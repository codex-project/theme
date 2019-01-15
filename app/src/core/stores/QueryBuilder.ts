import { injectable, lazyInject } from 'ioc';

import { merge, uniq } from 'lodash';
import { Api, api, FetchResult } from '@codex/api';
import { SyncHook } from 'tapable';
import { Fetched } from 'stores/Fetched';

const log = require('debug')('BuildQuery');

function isMergable(target) {
    if ( Array.isArray(target) ) return true;
    if ( typeof target === 'object' ) return true;
    return false;
}

export type BuildQueryReturn = {
    codex: api.Codex,
    project: api.Project,
    revision: api.Revision,
    document: api.Document,
}
type Fields = Record<string, string>

@injectable()
export class QueryBuilder {
    @lazyInject('api') api: Api;
    @lazyInject('fetched') fetched: Fetched;

    public readonly hooks = {
        get        : new SyncHook<this>([ 'builder' ]),
        queryFields: new SyncHook<string[], this>([ 'queryFields', 'builder' ]),
        queryResult: new SyncHook<FetchResult, this>([ 'queryResult', 'builder' ]),
        returns    : new SyncHook<BuildQueryReturn, this>([ 'returns', 'builder' ]),
    };

    protected codexFields: Fields    = {};
    protected projectFields: Fields  = {};
    protected revisionFields: Fields = {};
    protected documentFields: Fields = {};

    constructor(
        protected projectKey?: string,
        protected revisionKey?: string,
        protected documentKey?: string,
    ) {}

    protected addField(fields: Fields, name: string, fieldName?: string): this {
        fieldName      = fieldName || name;
        fields[ name ] = fieldName;
        return this;
    }

    protected addFields(fields: Fields, ...names: string[]): this {
        names.forEach(name => this.addField(fields, name));
        return this;
    }

    public addCodexField(name: string, fieldName?: string): this {return this.addField(this.codexFields, name, fieldName); }

    public addCodexFields(...names: string[]): this { return this.addFields(this.codexFields, ...names);}

    public addProjectField(name: string, fieldName?: string): this {return this.addField(this.projectFields, name, fieldName); }

    public addProjectFields(...names: string[]): this { return this.addFields(this.projectFields, ...names);}

    public addRevisionField(name: string, fieldName?: string): this {return this.addField(this.revisionFields, name, fieldName); }

    public addRevisionFields(...names: string[]): this { return this.addFields(this.revisionFields, ...names);}

    public addDocumentField(name: string, fieldName?: string): this {return this.addField(this.documentFields, name, fieldName); }

    public addDocumentFields(...names: string[]): this { return this.addFields(this.documentFields, ...names);}

    public withChanges(): this {
        this.addCodexField('changes')
            .addProjectFields('changes', 'inherits')
            .addRevisionFields('changes', 'inherits')
            .addDocumentFields('changes', 'inherits');
        return this;
    }

    protected isFieldFetched(path: string, name: string): boolean {return this.fetched.has(path + '.' + name); }

    protected getFieldNames(path: string, fields: Fields) {
        return Object
            .keys(fields)
            .filter(name => this.isFieldFetched(path, name) !== true)
            .map(name => fields[ name ]);
    }

    protected getCodexFieldNames() {return this.getFieldNames(this.fetched.getCodexPath(), this.codexFields); }

    protected getProjectFieldNames() {return this.getFieldNames(this.fetched.getProjectPath(this.projectKey), this.projectFields); }

    protected getRevisionFieldNames() {return this.getFieldNames(this.fetched.getRevisionPath(this.projectKey, this.revisionKey), this.revisionFields); }

    protected getDocumentFieldNames() {return this.getFieldNames(this.fetched.getDocumentPath(this.projectKey, this.revisionKey, this.documentKey), this.documentFields); }

    protected buildQueryFields() {
        let queryFields: string[] = [];
        let fieldNames            = this.getCodexFieldNames();
        fieldNames.length && queryFields.push(`
codex {
    ${fieldNames.join('\n')}
}`);
        if ( this.projectKey ) {
            let fieldNames = this.getProjectFieldNames();
            fieldNames.length && queryFields.push(`
project(key: "${this.projectKey}"){
    ${fieldNames.join('\n')}
}`);
        }
        if ( this.revisionKey ) {
            let fieldNames = this.getRevisionFieldNames();
            fieldNames.length && queryFields.push(`
revision(projectKey: "${this.projectKey}", revisionKey: "${this.revisionKey}"){
    ${fieldNames.join('\n')}
}`);
        }
        if ( this.documentKey ) {
            let fieldNames = this.getDocumentFieldNames();
            fieldNames.length && queryFields.push(`
document(projectKey: "${this.projectKey}", revisionKey: "${this.revisionKey}", documentKey: "${this.documentKey}"){
    ${fieldNames.join('\n')}
}`);
        }

        this.hooks.queryFields.call(queryFields, this);
        return queryFields;
    }


    async get(): Promise<BuildQueryReturn> {
        this.hooks.get.call(this);
        let queryFields = this.buildQueryFields();
        log('get()', 'queryFields', queryFields);
        if ( queryFields.length > 0 ) {
            let query    = `query {\n${queryFields.join('\n')}\n}`;
            let response = await this.api.query(query);
            this.hooks.queryResult.call(response, this);
            log('get()', 'response', response);
            let { data, errors, status } = response;

            if ( data.codex ) {
                let codex = this.fetched.getCodex();
                if ( data.codex.changes ) {
                    merge(codex, data.codex.changes);
                }
                this.fetched.setCodex(merge( codex, data.codex));
            }

            if ( data.project ) {
                let project  = this.fetched.getProject(this.projectKey);
                let inherits = {};
                // uniq([].concat(project.inherits || []).concat(data.project.inherits || []))
                //     .filter(inheritKey => this.fetched.hasCodexField(inheritKey))
                //     .forEach(inheritKey => inherits[ inheritKey ] = this.fetched.getCodex()[ inheritKey ]);
                // project = merge({}, project, inherits);

                if ( data.project.changes ) {
                    merge(project, data.project.changes);
                }
                this.fetched.setProject(this.projectKey, merge( project, data.project));
            }

            if ( data.revision ) {
                let revision = this.fetched.getRevision(this.projectKey, this.revisionKey);
                let inherits = {};
                // uniq([].concat(revision.inherits || []).concat(data.revision.inherits || []))
                //     .filter(inheritKey => this.fetched.hasProjectField(this.projectKey, inheritKey))
                //     .forEach(inheritKey => inherits[ inheritKey ] = this.fetched.getProject(this.projectKey)[ inheritKey ]);
                // revision = merge({}, revision, inherits);

                if ( data.revision.changes ) {
                    merge(revision, data.revision.changes);
                }
                this.fetched.setRevision(this.projectKey, this.revisionKey, merge( revision, data.revision));
            }

            if ( data.document ) {
                let document = this.fetched.getDocument(this.projectKey, this.revisionKey, this.documentKey);
                let inherits = {};
                // uniq([].concat(document.inherits || []).concat(data.document.inherits || []))
                //     .filter(inheritKey => this.fetched.hasRevisionField(this.projectKey, this.revisionKey, inheritKey))
                //     .forEach(inheritKey => inherits[ inheritKey ] = this.fetched.getRevision(this.projectKey, this.revisionKey)[ inheritKey ]);
                // document = merge({}, document, inherits);

                if ( data.document.changes ) {
                    merge(document, data.document.changes);
                }
                this.fetched.setDocument(this.projectKey, this.revisionKey, this.documentKey, merge( document, data.document));
            }
        }

        let returns = {
            codex   : this.fetched.getCodex(),
            project : this.fetched.getProject(this.projectKey),
            revision: this.fetched.getRevision(this.projectKey, this.revisionKey),
            document: this.fetched.getDocument(this.projectKey, this.revisionKey, this.documentKey),
        };

        this.hooks.returns.call(returns, this);

        log('get()', 'returns', returns);
        return returns;
    }

}

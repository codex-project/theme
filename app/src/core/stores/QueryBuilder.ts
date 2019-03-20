import { injectable, lazyInject } from '../ioc';

import { merge, uniq } from 'lodash';
// import { Api, api, FetchResult } from '@codex/api';
import { SyncHook } from 'tapable';
import { Fetched } from './Fetched';
import { Api, FetchResult, GraphQLError } from '@codex/api';

const log = require('debug')('BuildQuery');

function isMergable(target) {
    if ( Array.isArray(target) ) return true;
    if ( typeof target === 'object' ) return true;
    return false;
}

export type BuildQueryReturn = {
    codex: any //api.Codex,
    project: any //api.Project,
    revision: any //api.Revision,
    document: any //api.Document,
    errors: Record<string, Array<QueryError>>
}
type Fields = Record<string, string>

const codexQuery    = (fieldNames: string[]) => `
query CodexQuery {
    codex {
        ${fieldNames.join('\n')}
    }
}
`;
const projectQuery  = (fieldNames: string[]) => `
query ProjectQuery($projectKey:ID) {
    project(key: $projectKey){
        ${fieldNames.join('\n')}
    }
}
`;
const revisionQuery = (fieldNames: string[]) => `
query RevisionQuery($projectKey:ID, $revisionKey:ID) {
    revision(projectKey: $projectKey, revisionKey: $revisionKey){
        ${fieldNames.join('\n')}
    }
}
`;
const documentQuery = (fieldNames: string[]) => `
query RevisionQuery($projectKey:ID, $revisionKey:ID, $documentKey:ID) {
    document(projectKey: $projectKey, revisionKey: $revisionKey, documentKey: $documentKey){
        ${fieldNames.join('\n')}
    }
}
`;

export class QueryError extends Error implements Error, GraphQLError {
    constructor(error: GraphQLError) {
        super(error.message);
        Object.setPrototypeOf(this, new.target.prototype);
        // this.name      = 'QueryError';
        this.locations = error.locations;
        this.path      = error.path;
        if ( error[ 'trace' ] ) {
            this.stack = error[ 'trace' ];
        }
    }

    public locations: { line: number; column: number }[];
    public path: string[];
    public stack: string;
}

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

    buildQueryMap() {
        let fieldNames    = {
            codex   : this.getCodexFieldNames(),
            project : this.getProjectFieldNames(),
            revision: this.getRevisionFieldNames(),
            document: this.getDocumentFieldNames(),
        };
        let queryMap: any = {};
        if ( fieldNames.codex.length ) {
            queryMap.codex = {
                query: codexQuery(fieldNames.codex),
            };
        }
        if ( fieldNames.project.length && this.projectKey ) {
            queryMap.project = {
                query    : projectQuery(fieldNames.project),
                variables: { projectKey: this.projectKey },
            };
        }
        if ( fieldNames.revision.length && this.revisionKey ) {
            queryMap.revision = {
                query    : revisionQuery(fieldNames.revision),
                variables: { projectKey: this.projectKey, revisionKey: this.revisionKey },
            };
        }
        if ( fieldNames.document.length && this.documentKey ) {
            queryMap.document = {
                query    : documentQuery(fieldNames.document),
                variables: { projectKey: this.projectKey, revisionKey: this.revisionKey, documentKey: this.documentKey },
            };
        }

        return queryMap;
    }

    async query(signal?: AbortSignal) {
        const queryMap = this.buildQueryMap();
        const keys     = Object.keys(queryMap);
        const query    = await this.api.queryMapBatch(queryMap, { signal });
        log('query()', 'query', query);
        const data: any                                 = {};
        const errors: Record<string, Array<QueryError>> = {};
        new Error();
        keys.forEach(key => {
            let response = query.data[ key ];
            if ( response.errors && response.errors.length > 0 ) {
                errors[ key ] = response.errors.map(error => new QueryError(error));
            }
            if ( response.data && response.data[ key ] ) {
                data[ key ] = response.data[ key ];
            }
        });

        return { data, errors, response: query };
    }

    async get(signal?: AbortSignal): Promise<BuildQueryReturn> {
        this.hooks.get.call(this);
        const queryMap    = this.buildQueryMap();
        const shouldQuery = Object.keys(queryMap).length > 0;
        let errors        = {};
        if ( shouldQuery ) {
            let query = await this.query(signal);
            log('get()', 'query', query);
            let { data, response } = query;
            errors                 = query.errors;
            if ( data.codex ) {
                let codex = this.fetched.getCodex();
                if ( data.codex.changes ) {
                    merge(codex, data.codex.changes);
                }
                this.fetched.setCodex(merge(codex, data.codex));
            }

            if ( data.project ) {
                let project  = this.fetched.getProject(this.projectKey);
                let inherits = {};
                uniq([].concat(project.inherits || []).concat(data.project.inherits || []))
                    .filter(inheritKey => this.fetched.hasCodexField(inheritKey))
                    .forEach(inheritKey => inherits[ inheritKey ] = this.fetched.getCodex()[ inheritKey ]);
                project = merge({}, project, inherits);

                if ( data.project.changes ) {
                    merge(project, data.project.changes);
                }
                this.fetched.setProject(this.projectKey, merge({}, project, data.project));
            }

            if ( data.revision ) {
                let revision = this.fetched.getRevision(this.projectKey, this.revisionKey);
                let inherits = {};
                uniq([].concat(revision.inherits || []).concat(data.revision.inherits || []))
                    .filter(inheritKey => this.fetched.hasProjectField(this.projectKey, inheritKey))
                    .forEach(inheritKey => inherits[ inheritKey ] = this.fetched.getProject(this.projectKey)[ inheritKey ]);
                revision = merge({}, revision, inherits);

                if ( data.revision.changes ) {
                    merge(revision, data.revision.changes);
                }
                this.fetched.setRevision(this.projectKey, this.revisionKey, merge({}, revision, data.revision));
            }

            if ( data.document ) {
                let document = this.fetched.getDocument(this.projectKey, this.revisionKey, this.documentKey);
                let inherits = {};
                uniq([].concat(document.inherits || []).concat(data.document.inherits || []))
                    .filter(inheritKey => this.fetched.hasRevisionField(this.projectKey, this.revisionKey, inheritKey))
                    .forEach(inheritKey => inherits[ inheritKey ] = this.fetched.getRevision(this.projectKey, this.revisionKey)[ inheritKey ]);
                document = merge({}, document, inherits);

                if ( data.document.changes ) {
                    merge(document, data.document.changes);
                }
                this.fetched.setDocument(this.projectKey, this.revisionKey, this.documentKey, merge({}, document, data.document));
            }
        }

        let returns = {
            codex   : this.fetched.getCodex(),
            project : this.projectKey ? this.fetched.getProject(this.projectKey) : null,
            revision: this.revisionKey ? this.fetched.getRevision(this.projectKey, this.revisionKey) : null,
            document: this.documentKey ? this.fetched.getDocument(this.projectKey, this.revisionKey, this.documentKey) : null,
            errors,
        };

        this.hooks.returns.call(returns, this);

        log('get()', 'returns', returns);
        return returns;
    }

}

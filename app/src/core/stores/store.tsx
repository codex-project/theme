import React from 'react';

import { action, observable, runInAction, toJS } from 'mobx';
import { get, has, merge, set, snakeCase } from 'lodash';
import { injectable, postConstruct } from 'inversify';
import { LayoutStore } from './store.layout';
import { lazyInject } from '../ioc';

import { Api, api } from '@codex/api';
import { Breadcrumb } from '../interfaces';
import { HelmetProps } from 'react-helmet';

const log = require('debug')('store');

export interface HelmetStore extends Partial<HelmetProps> {
    merge(data: Partial<HelmetProps>)

    set<K extends keyof HelmetProps>(prop: K, value: HelmetProps[K])

    has<K extends keyof HelmetProps>(prop: K)

    get<K extends keyof HelmetProps>(prop: K, defaultValue?: HelmetProps[K])
}

@injectable()
export class Store {
    @lazyInject('api') api: Api;

    @lazyInject('store.layout') layout: LayoutStore;
    // public readonly document: DocumentStore;

    @observable helmet: HelmetStore         = {
        merge(helmet: Partial<HelmetProps>) {merge(this, helmet);},
        set<K extends keyof HelmetProps>(prop: K, value: HelmetProps[K]) {set(this, prop, value);},
        has<K extends keyof HelmetProps>(prop: K) {has(this, prop);},
        get<K extends keyof HelmetProps>(prop: K, defaultValue?: HelmetProps[K]) {get(this, prop, defaultValue);},
    };
    @observable codex: Partial<api.Codex>   = { ...BACKEND_DATA.codex };
    @observable config: Partial<api.Config> = { ...BACKEND_DATA.config };

    @observable breadcumbs = {
        items: [] as Breadcrumb[],
        set(items: Breadcrumb[]) {this.items = items;},
        add(...items: Breadcrumb[]) {this.items.push(...items);},
        pop() {this.items.pop();},
        clear() {this.set([]);},
    };

    @postConstruct()
    protected postConstruct() {
        log('postConstruct', this);
        // this.layout.merge(toJS(this.codex.layout));
        log('postConstructed', this);

    }

    toJS() {
        const { codex, config, fetching, project, revision, document, layout } = this;
        return toJS({ codex, config, fetching, project, revision, document, layout: layout.toJS() });
    }

    hasProject(key: string) {return ! ! this.getProject(key); }

    getProject(key: string) {return this.codex.projects.find(p => p.key === key); }

    hasRevision(projectKey: string, revisionKey: string) { return ! ! this.getRevision(projectKey, revisionKey);}

    getRevision(projectKey: string, revisionKey: string) {
        if ( ! this.hasProject(projectKey) ) return undefined;
        return this.getProject(projectKey).revisions.find(r => r.key === revisionKey);
    }

    @action set(prop: string, value: any) {set(this, prop, value); }

    has(prop: string) {return has(this, prop);}


    @observable fetching: boolean      = false;
    @observable project: api.Project   = null;
    @observable revision: api.Revision = null;
    @observable document: api.Document = null;

    @action mergeLayout(mergable: { layout?: Partial<api.Layout> }) {
        if ( mergable.layout ) {
            this.layout.merge(mergable.layout);
        }
    }

    @action setDocument(document: api.Document | null) {
        this.document = document;
        this.mergeLayout(document);
        if ( document ) {
            // this.key     = document.key;
            // this.content = document.content;
        }
    }

    @action setProject(project: api.Project | null) {
        this.project = project;
        this.mergeLayout(project);
    }

    @action setRevision(revision: api.Revision | null) {
        this.revision = revision;
        this.mergeLayout(revision);
    }

    async fetchDocument(project: string, revision: string, document: string) {
        runInAction(() => {
            this.fetching = true;
            // this.content  = null;
        });
        await this.fetch(project, revision, document);
        runInAction(() => {
            this.fetching = false;
        });
    }

    fetched: any = {};

    protected async fetch(projectKey: string, revisionKey: string, documentKey: string) {
        let query        = [];
        let projectPath  = `projects.${snakeCase(projectKey)}`;
        let revisionPath = `revisions.${snakeCase(projectKey)}.${snakeCase(revisionKey)}`;
        let documentPath = `documents.${snakeCase(projectKey)}.${snakeCase(revisionKey)}.${snakeCase(documentKey)}`;
        let hasProject   = has(this.fetched, projectPath);
        let hasRevision  = has(this.fetched, revisionPath);
        let hasDocument  = has(this.fetched, documentPath);

        if ( ! hasProject ) {
            query.push(`
project(key: $projectKey){
    key
    display_name
    description
    changes
}`);
        }
        if ( ! hasRevision ) {
            query.push(`
revision(projectKey: $projectKey, revisionKey: $revisionKey){
    key
    changes
}`);
        }
        if ( ! hasDocument ) {
            query.push(`
document(projectKey: $projectKey, revisionKey: $revisionKey, documentKey: $documentKey){
    key
    changes
    content
}`);
        }

        if ( query.length > 0 ) {
            let result = await this.api.query(`
query Fetch($projectKey: ID!, $revisionKey: ID!, $documentKey: ID!) {
    ${query.join('\n')}
}        
        `, { projectKey, revisionKey, documentKey });

            if ( ! hasProject ) {
                set(this.fetched, projectPath, result.project.changes);
                set(this.fetched, projectPath + '.key', result.project.key);
                set(this.fetched, projectPath + '.display_name', result.project.display_name);
                set(this.fetched, projectPath + '.description', result.project.description);
            }
            if ( ! hasRevision ) {
                set(this.fetched, revisionPath, result.revision.changes);
                set(this.fetched, revisionPath + '.key', result.revision.key);
            }
            if ( ! hasDocument ) {
                set(this.fetched, documentPath, result.document.changes);
                set(this.fetched, documentPath + '.key', result.document.key);
                set(this.fetched, documentPath + '.content', result.document.content);
            }
        }

        runInAction(() => {
            if ( ! this.project || this.project.key !== projectKey ) {
                this.setProject(get(this.fetched, projectPath));
                this.revision = null;
                this.document = null;
            }
            if ( ! this.revision || this.revision.key !== revisionKey ) {
                this.setRevision(get(this.fetched, revisionPath));
                this.document = null;
            }
            if ( ! this.document || this.document.key !== documentKey ) {
                this.setDocument(get(this.fetched, documentPath));
            }
        });

    }
}

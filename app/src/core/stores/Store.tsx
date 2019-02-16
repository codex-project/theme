import React from 'react';

import { action, computed, observable, toJS, transaction } from 'mobx';
import { get, has, merge, set } from 'lodash';
import { injectable, postConstruct } from 'inversify';
import { LayoutStore } from './LayoutStore';
import { app, lazyInject } from '../ioc';

import { Api, api } from '@codex/api';
import { Breadcrumb } from '../interfaces';
import { HelmetProps } from 'react-helmet';
import { BuildQueryReturn, QueryBuilder } from './QueryBuilder';
import { Fetched } from './Fetched';
import { SyncHook } from 'tapable';

const log = require('debug')('store');

export interface HelmetStore extends Partial<HelmetProps> {
    merge(data: Partial<HelmetProps>)

    set<K extends keyof HelmetProps>(prop: K, value: HelmetProps[K])

    has<K extends keyof HelmetProps>(prop: K)

    get<K extends keyof HelmetProps>(prop: K, defaultValue?: HelmetProps[K])
}

export interface ProjectPart {
    key: string
    default_revision: string
    display_name
    description
    revisions: RevisionPart[]
}

export interface RevisionPart {
    key: string
    default_document: string
}

@injectable()
export class Store {
    public readonly hooks = {
        fetch  : new SyncHook<QueryBuilder>([ 'builder' ]),
        fetched: new SyncHook<BuildQueryReturn>([ 'result' ]),
    };

    @lazyInject('api') api: Api;
    @lazyInject('fetched') fetched: Fetched;
    @lazyInject('store.layout') layout: LayoutStore;

    @observable config: Partial<api.Config> = { ...BACKEND_DATA.config };
    @observable helmet: HelmetStore         = {
        merge(helmet: Partial<HelmetProps>) {merge(this, helmet);},
        set<K extends keyof HelmetProps>(prop: K, value: HelmetProps[K]) {set(this, prop, value);},
        has<K extends keyof HelmetProps>(prop: K) {has(this, prop);},
        get<K extends keyof HelmetProps>(prop: K, defaultValue?: HelmetProps[K]) {get(this, prop, defaultValue);},
    };
    @observable breadcumbs                  = {
        items: [] as Breadcrumb[],
        set(items: Breadcrumb[]) {this.items = items;},
        add(...items: Breadcrumb[]) {this.items.push(...items);},
        pop() {this.items.pop();},
        clear() {this.set([]);},
    };

    @computed get codex(): Partial<api.Codex> { return this.fetched.fetched.codex; }

    @postConstruct()
    protected postConstruct() {
        if ( app.config.cache ) {
            this.fetched.hooks.setted.tap('CORE', () => {
                this.fetched.saveToStorage();
            });
            this.fetched.loadFromStorage();
        }
        this.fetched.setCodex(BACKEND_DATA.codex);
        log('postConstruct', this);
    }

    toJS(path?: string) {
        if ( path ) {
            return toJS(get(this, path));
        }
        const { codex, config, project, revision, document, layout } = this;
        return toJS({ codex, config, project, revision, document, layout: layout.toJS() });
    }

    @action set(prop: string, value: any) {set(this, prop, value); }

    has(prop: string) {return has(this, prop);}

    hasProject(key: string): boolean {return ! ! this.getProject(key); }

    getProject(key: string): ProjectPart {return this.codex.projects.find(p => p.key === key) as any; }

    hasRevision(projectKey: string, revisionKey: string): boolean { return ! ! this.getRevision(projectKey, revisionKey);}

    getRevision(projectKey: string, revisionKey: string): RevisionPart {
        if ( ! this.hasProject(projectKey) ) return undefined;
        return this.getProject(projectKey).revisions.find(r => r.key === revisionKey) as any;
    }

    getDocumentParams(projectKey?: string, revisionKey?: string, documentKey?: string) {
        projectKey = projectKey || this.codex.default_project;
        if ( ! this.hasProject(projectKey) ) {
            projectKey = this.codex.default_project;
            // log(`Project [${projectKey}] not found`);
            throw new Error(`Project [${projectKey}] not found`);
        }
        let project = this.getProject(projectKey);

        revisionKey = revisionKey || project.default_revision;
        if ( ! this.hasRevision(projectKey, revisionKey) ) {
            revisionKey = project.default_revision;
            // log(`Revision [${revisionKey}] for project [${projectKey}] not found`);
            throw new Error(`Revision [${revisionKey}] for project [${projectKey}] not found`);
        }
        let revision = this.getRevision(projectKey, revisionKey);

        documentKey = documentKey || revision.default_document;

        return {
            project : projectKey,
            revision: revisionKey,
            document: documentKey,
        };
    }

    isProject(project: string) { return this.project && this.project.key === project; }

    isRevision(project: string, revision: string) { return this.isProject(project) && this.revision && this.revision.key === revision; }

    isDocument(project: string, revision: string, document: string) { return this.isRevision(project, revision) && this.document && this.document.key === document; }

    @observable project: api.Project   = null;
    @observable revision: api.Revision = null;
    @observable document: api.Document = null;

    @action mergeLayout(mergable: { layout?: Partial<api.Layout> }) {
        if ( mergable.layout ) {
            this.layout.merge(mergable.layout);
        }
        return this;
    }

    @action setDocument(document: api.Document | null) {
        this.document = document;
        return this;
    }

    @action setProject(project: api.Project | null) {
        this.project = project;
        return this;
    }

    @action setRevision(revision: api.Revision | null) {
        this.revision = revision;
        return this;
    }

    async fetchDocument(projectKey: string, revisionKey: string, documentKey: string) {
        if ( this.isDocument(projectKey, revisionKey, documentKey)
        // (projectKey && this.project && this.project.key === projectKey)
        // && (revisionKey && this.revision && this.revision.key === revisionKey)
        // && (documentKey && this.document && this.document.key === documentKey)
        ) {
            return this.document;
        }
        await this.fetch(projectKey, revisionKey, documentKey);
        if ( this.document && this.document.meta ) {
            this.helmet.merge(this.document.meta);
        }
        return this.document;
    }

    async fetchRevision(projectKey: string, revisionKey: string) {
        if (
            (projectKey && this.project && this.project.key === projectKey)
            && (revisionKey && this.revision && this.revision.key === revisionKey)
        ) {
            return this.revision;
        }
        await this.fetch(projectKey, revisionKey);
        return this.revision;
    }

    async fetchProject(projectKey: string) {
        await this.fetch(projectKey);
        return this.project;
    }

    fetching = false;

    async fetch(projectKey?: string, revisionKey?: string, documentKey?: string) {
        if ( this.fetching ) return;
        this.fetching = true;
        let query     = new QueryBuilder(projectKey, revisionKey, documentKey);
        query.withChanges()
            .addProjectFields('key', 'display_name', 'description')
            .addRevisionFields('key')
            .addDocumentFields('key', 'content');

        // query      = this.hooks.fetch.call(query);
        let result = await query.get();
        transaction(() => {
            let layout;
            if ( projectKey && (! this.project || this.project.key !== projectKey) ) {
                this.project  = null;
                this.revision = null;
                this.document = null;
                this.project  = result.project;
                layout        = result.project;
                this.mergeLayout(layout);
            }
            if ( revisionKey && (! this.revision || this.revision.key !== revisionKey) ) {
                this.revision = null;
                this.document = null;
                this.revision = result.revision;
                layout        = result.revision;
                this.mergeLayout(layout);
            }
            if ( documentKey && (! this.document || this.document.key !== documentKey) ) {
                this.document = null;
                this.document = result.document;
                layout        = result.document;
                this.mergeLayout(layout);
            }
            if ( layout ) {
                this.mergeLayout(layout);
            }
        });

        log('fetched', { result });
        this.fetching = false;
        // this.hooks.fetched.call(result);
        return result;
    }

}

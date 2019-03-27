// noinspection ES6UnusedImports
import { get, has, merge, set, snakeCase } from 'lodash';
import { api } from '@codex/api';
import { LocalStorage } from '../utils/storage'
import { SyncHook } from 'tapable';
import { injectable } from '../ioc'

const STORAGE_KEY: string = 'codex.fetched';

export interface FetchedData {
    codex?: Partial<api.Codex>
    projects?: Record<string, Partial<api.Project>>
    revisions?: Record<string, Record<string, Partial<api.Revision>>>
    documents?: Record<string, Record<string, Record<string, Partial<api.Document>>>>
}

@injectable()
export class Fetched {
    public static readonly STORAGE_KEY: string = STORAGE_KEY;

    public readonly hooks = {
        set               : new SyncHook<any, string, Fetched>([ 'value', 'path', 'fetched' ]),
        setted            : new SyncHook<any, string, Fetched>([ 'value', 'path', 'fetched' ]),
        get               : new SyncHook<any, string, Fetched>([ 'value', 'path', 'fetched' ]),
        loadFromStorage   : new SyncHook<any, Fetched>([ 'value', 'fetched' ]),
        loadedFromStorage : new SyncHook<Fetched>([ 'fetched' ]),
        saveToStorage     : new SyncHook<Fetched>([ 'fetched' ]),
        savedToStorage    : new SyncHook<Fetched>([ 'fetched' ]),
        removeFromStorage : new SyncHook<Fetched>([ 'fetched' ]),
        removedFromStorage: new SyncHook<Fetched>([ 'fetched' ]),
    };

    fetched: FetchedData = {};

    public getFetched() { return this.fetched; }

    public setFetched(fetched: any) { this.fetched = fetched; }

    public has(path: string) {return has(this.fetched, path); }

    public get(path: string, defaultValue: any = {}) {
        let value = get(this.fetched, path, defaultValue);
        this.hooks.get.call(value, path, this);
        return value;
    }

    public set(path: string, value: any) {
        this.hooks.set.call(value, path, this);
        set(this.fetched, path, value);
        this.hooks.setted.call(value, path, this);
        return this;
    }

    public existInStorage(): boolean {
        return LocalStorage.has(Fetched.STORAGE_KEY);
    }

    public getFromStorage(): any {
        return LocalStorage.get.item(Fetched.STORAGE_KEY);
    }

    public loadFromStorage() {
        let value: any = {};
        if ( this.existInStorage() ) {
            value = LocalStorage.get.item(Fetched.STORAGE_KEY);
        }
        this.hooks.loadFromStorage.call(value);
        this.fetched = value;
        this.hooks.loadedFromStorage.call(this);
        return this;
    }

    public saveToStorage() {
        this.removeFromStorage();
        this.hooks.saveToStorage.call(this);
        LocalStorage.set(Fetched.STORAGE_KEY, this.fetched);
        this.hooks.savedToStorage.call(this);
        return this;
    }


    public removeFromStorage() {
        this.hooks.removeFromStorage.call(this);
        if ( this.existInStorage() ) {
            LocalStorage.remove(Fetched.STORAGE_KEY);
        }
        this.hooks.removedFromStorage.call(this);
        return this;
    }

    public codexPath: string = 'codex';

    public getCodexPath(): string {return this.codexPath; }

    public getProjectPath(projectKey: string): string {return `projects.${snakeCase(projectKey)}`; }

    public getRevisionPath(projectKey: string, revisionKey: string): string {return `revisions.${snakeCase(projectKey)}.${snakeCase(revisionKey)}`; }

    public getDocumentPath(projectKey: string, revisionKey: string, documentKey: string): string {return `documents.${snakeCase(projectKey)}.${snakeCase(revisionKey)}.${documentKey.replace(/\./g, '_')}`; }

    public hasCodex(): boolean { return this.has(this.getCodexPath());}

    public hasProject(projectKey: string): boolean { return this.has(this.getProjectPath(projectKey));}

    public hasRevision(projectKey: string, revisionKey: string): boolean { return this.has(this.getRevisionPath(projectKey, revisionKey));}

    public hasDocument(projectKey: string, revisionKey: string, documentKey: string): boolean { return this.has(this.getDocumentPath(projectKey, revisionKey, documentKey));}

    public hasCodexField(name: string): boolean { return this.has(this.getCodexPath() + '.' + name);}

    public hasProjectField(projectKey: string, name: string): boolean { return this.has(this.getProjectPath(projectKey) + '.' + name);}

    public hasRevisionField(projectKey: string, revisionKey: string, name: string): boolean { return this.has(this.getRevisionPath(projectKey, revisionKey) + '.' + name);}

    public hasDocumentField(projectKey: string, revisionKey: string, documentKey: string, name: string): boolean { return this.has(this.getDocumentPath(projectKey, revisionKey, documentKey) + '.' + name);}

    public getCodex(): api.Codex { return this.get(this.getCodexPath());}

    public getProject(projectKey: string): api.Project { return this.get(this.getProjectPath(projectKey));}

    public getRevision(projectKey: string, revisionKey: string): api.Revision { return this.get(this.getRevisionPath(projectKey, revisionKey));}

    public getDocument(projectKey: string, revisionKey: string, documentKey: string): api.Document { return this.get(this.getDocumentPath(projectKey, revisionKey, documentKey));}

    public setCodex(value: Partial<api.Codex>) {
        this.set(this.getCodexPath(), value);
        if ( value.projects ) {
            value.projects.forEach(project => {
                this.mergeProject(project.key, project);
                if ( project.revisions ) {
                    project.revisions.forEach(revision => this.mergeRevision(project.key, revision.key, revision));
                }
            });
        }
        return this;
    }

    public setProject(projectKey: string, value: any) { return this.set(this.getProjectPath(projectKey), value);}

    public setRevision(projectKey: string, revisionKey: string, value: any) { return this.set(this.getRevisionPath(projectKey, revisionKey), value);}

    public setDocument(projectKey: string, revisionKey: string, documentKey: string, value: any) { return this.set(this.getDocumentPath(projectKey, revisionKey, documentKey), value);}

    public merge(path: string, value: any) {return this.set(path, merge({}, this.get(path), value)); }

    public mergeProject(projectKey: string, value: Partial<api.Project>) { return this.merge(this.getProjectPath(projectKey), value);}

    public mergeRevision(projectKey: string, revisionKey: string, value: Partial<api.Revision>) { return this.merge(this.getRevisionPath(projectKey, revisionKey), value);}

    public mergeDocument(projectKey: string, revisionKey: string, documentKey: string, value: Partial<api.Document>) { return this.merge(this.getDocumentPath(projectKey, revisionKey, documentKey), value);}

}

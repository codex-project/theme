import { injectable } from 'inversify';
import { lazyInject } from '@codex/core';
import { api, Api } from '@codex/api';
import { NamedCollection } from './collections';
import { PhpdocFile } from './types';

export interface PhpdocManifest extends api.PhpdocManifest {}

export class PhpdocManifest {
    @lazyInject('api') protected _api: Api;
    files: NamedCollection<api.PhpdocManifestFile>;
    protected _files: Record<string, PhpdocFile> = {};

    constructor(data: api.PhpdocManifest) {
        Object.assign(this, data);
        this.files = new NamedCollection(...data.files);
    }

    async fetchFile(fullName: string):Promise<PhpdocFile> {
        if ( this._files[ fullName ] === undefined ) {
            let result = await this._api.query(`
query GetFile($projectKey:ID!, $revisionKey:ID!, $fullName:String!) {
    phpdoc(projectKey:$projectKey, revisionKey:$revisionKey){
        file(fullName:$fullName) {
            type
            hash
            source
            
            docblock @assoc
            class @assoc
            trait @assoc
            interface @assoc
        }
    }
}`, { projectKey: this.project, revisionKey: this.revision, fullName });

            this._files[ fullName ] = new PhpdocFile(result.data.phpdoc.file);
        }

        return this._files[ fullName ];

    }

}

@injectable()
export class PhpdocStore {
    @lazyInject('api') api: Api;

    protected _manifests: Record<string, PhpdocManifest> = {};
    typeClickHandler:any=()=>null
    async fetchManifest(projectKey: string, revisionKey: string): Promise<PhpdocManifest> {
        if ( this._manifests[ projectKey + '/' + revisionKey ] === undefined ) {
            let result                                        = await this.api.query(`
query GetManifest($projectKey:ID!, $revisionKey:ID!) {
    phpdoc(projectKey:$projectKey, revisionKey:$revisionKey){
        default_class
        last_modified
        title
        version
        project
        revision
        files {
            name
            hash
            type
        }
    }
}`, { projectKey, revisionKey });
            this._manifests[ projectKey + '/' + revisionKey ] = new PhpdocManifest(result.data.phpdoc);
        }

        return this._manifests[ projectKey + '/' + revisionKey ];
    }
}

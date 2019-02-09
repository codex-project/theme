import { injectable } from 'inversify';
import { lazyInject } from '@codex/core';
import { api, Api } from '@codex/api';
import { NamedCollection } from './collections';
import { PhpdocFile } from './types';
import { FQNS } from './FQNS';

export interface PhpdocManifest extends api.PhpdocManifest {}

export class PhpdocManifest {
    @lazyInject('api') protected _api: Api;
    files: NamedCollection<api.PhpdocManifestFile>;
    protected _files: Record<string, Promise<PhpdocFile>> = {};

    constructor(protected _data: api.PhpdocManifest) {
        Object.assign(this, _data);
        this.files = new NamedCollection(..._data.files);
    }

    async fetchFile(fullName: string | FQNS): Promise<PhpdocFile> {
        fullName = FQNS.from(fullName).slashEntityName;

        if ( this._files[ fullName ] === undefined ) {
            this._files[ fullName ] = this._api.query(`
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
}`, { projectKey: this.project, revisionKey: this.revision, fullName }).then(value => new PhpdocFile(value.data.phpdoc.file));
        }

        return await this._files[ fullName ];

    }

}

@injectable()
export class PhpdocStore {
    @lazyInject('api') api: Api;

    protected _manifests: Record<string, Promise<PhpdocManifest>> = {};
    typeClickHandler: any                                         = () => null;

    async fetchManifest(projectKey: string, revisionKey: string): Promise<PhpdocManifest> {
        if ( this._manifests[ projectKey + '/' + revisionKey ] === undefined ) {
            this._manifests[ projectKey + '/' + revisionKey ] = this.api.query(`
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
}`, { projectKey, revisionKey }).then(result => new PhpdocManifest(result.data.phpdoc));
        }

        return await this._manifests[ projectKey + '/' + revisionKey ];
    }
}

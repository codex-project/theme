import { injectable } from 'inversify';
import { lazyInject } from '@codex/core';
import { api, Api } from '@codex/api';
import { NamedCollection } from './collections';
import { PhpdocFile } from './types';
import { FQSEN } from './FQSEN';

export interface PhpdocManifest extends api.PhpdocManifest {}

export class PhpdocManifest {
    @lazyInject('api') protected _api: Api;
    files: NamedCollection<api.PhpdocManifestFile>;
    protected _fetchedFiles: Record<string, Promise<PhpdocFile>> = {};

    constructor(protected _data: api.PhpdocManifest) {
        Object.assign(this, _data);
        this.files = new NamedCollection(..._data.files);
    }

    async fetchFile(fullName: string | FQSEN): Promise<PhpdocFile> {
        fullName = FQSEN.from(fullName).slashEntityName;

        if ( this._fetchedFiles[ fullName ] === undefined ) {
            this._fetchedFiles[ fullName ] = this._api.query(`
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
}`, { projectKey: this.project, revisionKey: this.revision, fullName }).then(async value => new PhpdocFile(value.data.phpdoc.file));
        }

        return await this._fetchedFiles[ fullName ];

    }

}

@injectable()
export class PhpdocStore {
    @lazyInject('api') api: Api;

    protected _fetchedManifests: Record<string, Promise<PhpdocManifest>> = {};
    typeClickHandler: any                                                = () => null;

    async fetchManifest(projectKey: string, revisionKey: string): Promise<PhpdocManifest> {
        if ( this._fetchedManifests[ projectKey + '/' + revisionKey ] === undefined ) {
            this._fetchedManifests[ projectKey + '/' + revisionKey ] = this.api.query(`
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
}`, { projectKey, revisionKey }).then(async result => new PhpdocManifest(result.data.phpdoc));
        }

        return await this._fetchedManifests[ projectKey + '/' + revisionKey ];
    }
}

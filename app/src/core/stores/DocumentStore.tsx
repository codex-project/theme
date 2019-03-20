import { injectable, lazyInject } from 'ioc';
import { Api } from '@codex/api';
import { LayoutStore } from 'stores';


const projectQuery  = `
query ProjectQuery($project:ID) {
    project(key: $project){
        key
        display_name
        description
        inherits
        changes
    }
}
`;
const revisionQuery = `
query RevisionQuery($project:ID, $revision:ID) {
    revision(projectKey: $project, revisionKey: $revision){
        key
        inherits
        changes
    }
}
`;
const documentQuery = `
query RevisionQuery($project:ID, $revision:ID, $document:ID) {
    document(projectKey: $project, revisionKey: $revision, documentKey: $document){
        key
        inherits
        changes
    }
}
`;

@injectable()
export class DocumentStore {

    @lazyInject('api') api: Api;
    @lazyInject('store.layout') layout: LayoutStore;

    async fetchDocument() {

        let result = await this.api.queryMapBatch({
            project : { query: projectQuery, variables: { project: 'codex' } },
            revision: { query: revisionQuery, variables: { project: 'codex', revision: 'master' } },
            document: { query: documentQuery, variables: { project: 'codex', revision: 'master', document: 'index' } },
        });
        if('project' in result.data && 'data' in result.data.project && 'project' in result.data.project.data.project){

        }

        return result;
    }

}


class Project {

}

class Revision {

}

class Document {
    constructor(
        public readonly project: Project,
    ) {}
}

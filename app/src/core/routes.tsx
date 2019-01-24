import { url } from 'classes/Url';
import { action } from 'mobx';
import DocumentationNode from 'routing/nodes/DocumentationNode';
import React from 'react';
import { BaseRoute } from 'routing/BaseRoute';
import HomePage from 'pages/HomePage';
import { app } from 'ioc';

const log = require('debug')('routes');

export class HomeRoute extends BaseRoute {
    public static id = 'home';

    path = url.root();

    public async onActivate(toState, fromState): Promise<any> {
        log('home onActivate', { toState, fromState });
        let promise = new Promise((resolve, reject) => setTimeout(resolve, 500));
        let result  = await promise;
        log('home onActivate done', { toState, fromState, result, promise });
    }

    component = () => <HomePage/>;
}


export class DocumentationRoute extends BaseRoute {
    public static id = 'documentation';

    path = url.documentation();

    @action
    async onActivate(toState, fromState): Promise<any> {
        log('documentation onActivate', { toState, fromState });
        let promise = new Promise((resolve, reject) => setTimeout(resolve, 500));
        let result  = await promise;
        log('documentation onActivate done', { toState, fromState, result, promise });
    }

    component = DocumentationNode;

    public async forward(toState, fromState): Promise<any> {
        return {
            name  : 'documentation.project',
            params: { project: app.store.codex.default_project },
        };
    }
}


export class DocumentationProjectRoute extends BaseRoute {
    public static id = 'documentation.project';

    path      = url.documentation(':project');
    component = DocumentationNode;

    public async forward(toState, fromState): Promise<any> {
        const { project } = toState.params;
        if ( ! app.store.hasProject(project) ) {
            throw new Error(`Project ${project} does not exist`);
        }

        return {
            name  : 'documentation.revision',
            params: { project, revision: app.store.getProject(project).default_revision },
        };
    }
}


export class DocumentationRevisionRoute extends BaseRoute {
    public static id = 'documentation.revision';

    path      = url.documentation(':project/:revision');
    component = DocumentationNode;

    public async forward(toState, fromState): Promise<any> {
        const { project, revision } = toState.params;
        if ( ! app.store.hasProject(project) ) {
            throw new Error(`Project ${project} does not exist`);
        }
        if ( ! app.store.hasRevision(project, revision) ) {
            throw new Error(`Revision ${revision} does not exist`);
        }

        return {
            name  : 'documentation.document',
            params: { project, revision, document: app.store.getRevision(project, revision).default_document },
        };
    }
}


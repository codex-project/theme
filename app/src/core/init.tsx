import React from 'react';
import { app } from 'ioc';
import { configure } from 'mobx';
import { containerModule } from './container-module';
import { ColorElement } from './elements/ColorElement';
import { RouterPlugin } from 'router';
import { MenuPlugin } from 'menus/plugin';
import { CodeHighlight } from 'components/code-highlight';
import HomePage from 'pages/HomePage';


const log = require('debug')('index');

//mobx
configure({ enforceActions: 'never' });

app.load(containerModule);
app.plugin(new MenuPlugin());
app.plugin(new RouterPlugin({
    defaultRoute    : 'documentation',
    startPathOrState: () => window.location.pathname.length > 1 ? window.location.pathname : undefined,
    routes          : [
        {
            name     : 'home',
            path     : app.url.root(),
            component: HomePage,
            loadData : async (toState, fromState) => {
                log('home loadData', { toState, fromState });
                let promise = new Promise((resolve, reject) => setTimeout(() => resolve({ home: 'ok' }), 500));
                let result  = await promise;
                log('home loadData done', { toState, fromState, result, promise });
                return { data: result };
            },

        },
        {
            name   : 'documentation',
            path   : app.url.documentation(),
            forward: async (toState, fromState) => {
                return {
                    name  : 'documentation.project',
                    params: { project: app.store.codex.default_project },
                };
            },
        },
        {
            name   : 'documentation.project',
            path   : '/:project',
            forward: async (toState, fromState) => {
                const { project } = toState.params;
                if ( ! app.store.hasProject(project) ) {
                    throw new Error(`Project ${project} does not exist`);
                }

                return {
                    name  : 'documentation.revision',
                    params: { project, revision: app.store.getProject(project).default_revision },
                };
            },
        },
        {
            name   : 'documentation.revision',
            path   : '/:project/:revision',
            forward: async (toState, fromState) => {
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
            },
        },
        {
            name         : 'documentation.document',
            path         : '/:project/:revision/*document',
            loadComponent: (toState, fromState) => import('./pages/DocumentPage'),
            loadData     : async (toState, fromState) => {
                log('documentation.document loadData', { toState, fromState });
                const { project, revision, document } = toState.params;
                let result                            = await app.store.fetchDocument(project, revision, document);
                log('documentation.document loadData done', { toState, fromState, result });
                return { document: result };
            },
        },
        {
            name      : 'test',
            path      : '/test',
            onActivate: async (toState, fromState, data) => {
                data.set('', '');

            },
            component : (_props) => {
                const { router, ...props } = _props;
                let code;
                try {
                    code = JSON.stringify(props, null, 4);
                } catch ( e ) {
                    code = require('util').inspect(props, false, 2, false);
                }
                return (
                    <div>
                        <h2>test</h2>
                        <CodeHighlight language="json" code={code}/>
                    </div>
                );
            },
        },
    ],
}));
app.hooks.registered.tap('CORE', app => {
    if ( app.plugins.has('menu') ) {
        let menuPlugin = app.plugins.get<MenuPlugin>('menu');
        menuPlugin.hooks.register.tap('CORE', manager => {

        });
    }
});
customElements.define(ColorElement.TAG, ColorElement);

import React from 'react';

import { configure } from 'mobx';
import { app } from 'ioc';
import { MenuPlugin } from 'menus';
import { RouterPlugin } from 'router';
import Root from 'components/Root';
import { ColorElement } from 'elements';
import { generatePath, Redirect } from 'react-router';
import { ErrorPage } from 'pages/index';

const log = require('debug')('site:index');

configure({ enforceActions: 'never' });

customElements.define(ColorElement.TAG, ColorElement);


const menuPlugin   = new MenuPlugin();
const routerPlugin = new RouterPlugin({
    defaultRoute: 'documentation',
});
app.Component = Root;
app
    .plugin(menuPlugin)
    .plugin(routerPlugin);

app.hooks.registered.tap('CORE', app => {
    if ( app.plugins.has('menu') ) {
        let menuPlugin = app.plugins.get<MenuPlugin>('menu');
        menuPlugin.hooks.register.tap('CORE', manager => {

        });
    }
});

routerPlugin.hooks.registered.tap('CORE', routes => {
    routes.push({
            name  : 'home',
            path  : '/',
            action: async (props, routeState) => {
                let promise    = new Promise((resolve, reject) => setTimeout(() => resolve({ home: 'ok' }), 500));
                let result     = await promise;
                const HomePage = (await import(/* webpackChunkName: "core.pages.home" */'./pages/HomePage')).default;
                return <HomePage {...props} {...result} />;
            },
        },
        {
            name  : 'documentation',
            path  : '/documentation',
            action: async (props, routeState) => {
                let to = generatePath(routes.get('documentation.project').path, { project: BACKEND_DATA.codex.default_project });
                return <Redirect to={to}/>;
            },
        },
        {
            name  : 'documentation.project',
            path  : '/documentation/:project',
            action: async (props, routeState) => {
                let params  = { project: routeState.params.project, revision: 'master' };
                let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
                if ( ! project ) {
                    return <ErrorPage {...props} routeState={routeState} title='Project not found' message={<p>Could not find the project [{params.project}]</p>}/>;
                }
                let to = generatePath(routes.get('documentation.revision').path, params);
                return <Redirect to={to}/>;
            },
        },
        {
            name  : 'documentation.revision',
            path  : '/documentation/:project/:revision',
            action: async (props, routeState) => {
                let params  = { project: routeState.params.project, revision: routeState.params.revision, document: 'index' };
                let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
                if ( ! project ) {
                    return <ErrorPage {...props} routeState={routeState} title='Project not found' message={<p>Could not find the project [{params.project}]</p>}/>;
                }
                let revision = project.revisions.find(r => r.key === params.revision);
                if ( ! revision ) {
                    return <ErrorPage {...props} routeState={routeState} title="Revision not found" message={<p>Could not find revision [{params.revision}] in project [{project.key}]</p>}/>;
                }
                let to = generatePath(routes.get('documentation.document').path, params);
                return <Redirect to={to}/>;
            },
        },
        {
            name  : 'documentation.document',
            path  : '/documentation/:project/:revision/:document+',
            action: async (props, routeState) => {
                let params  = routeState.params;
                let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
                if ( ! project ) {
                    return <ErrorPage {...props} routeState={routeState} title='Project not found' message={<p>Could not find the project [{params.project}]</p>}/>;
                }
                let revision = project.revisions.find(r => r.key === params.revision);
                if ( ! revision ) {
                    return <ErrorPage {...props} routeState={routeState} title="Revision not found" message={<p>Could not find revision [{params.revision}] in project [{project.key}]</p>}/>;
                }

                log('documentation.document', 'FETCH', params);
                let document, Component;
                try {
                    // app.store.fetchDocument(params.project, params.revision, params.document);
                    Component = (await import(/* webpackChunkName: "core.pages.document" */'./pages/DocumentPage')).default;
                    log('documentation.document', 'FETCHING', params, app.store.document, Component);
                    return <Component {...props} routeState={routeState} project={params.project} revision={params.revision} document={params.document}/>;
                } catch ( error ) {
                    console.warn('documentation.document', 'FETCH_ERROR', { e: error, params, document, Component });
                    return <ErrorPage {...props} routeState={routeState} title={error.name} message={<p>{error.message || ''}</p>}/>;
                }
            },
        },
    );
});

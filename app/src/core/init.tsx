import React from 'react';

import { configure } from 'mobx';
import { app } from 'ioc';
import { MenuPlugin } from 'menus';
import { RouterPlugin } from 'router';
import Root from 'components/Root';
import { ColorElement } from 'elements';

const log = require('debug')('site:index');

configure({ enforceActions: 'never' });

customElements.define(ColorElement.TAG, ColorElement);


const menuPlugin   = new MenuPlugin();
const routerPlugin = new RouterPlugin({
    defaultRoute: 'documentation',
});
app.notification.config({});
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

routerPlugin.hooks.registered.tap('CORE', router => {
    router.addRoutes({
            name         : 'home',
            path         : '/',
            loadComponent: () => import(/* webpackChunkName: "core.pages.home" */'./pages/HomePage'),
        }, {
            name         : 'test',
            path         : '/test',
            loadComponent: () => import('./pages/TestPage'),
        },
        {
            name    : 'documentation',
            path    : '/documentation',
            redirect: async (state, router) => ({ name: 'documentation.project', params: { project: BACKEND_DATA.codex.default_project } }),
        },
        {
            name    : 'documentation.project',
            path    : '/documentation/:project',
            redirect: async (state, router) => {
                let params  = { project: state.params.project, revision: 'master' };
                let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
                if ( ! project ) {
                    // return <ErrorPage {...props} routeState={routeState} title='Project not found' message={<p>Could not find the project [{params.project}]</p>}/>;
                }
                return { name: 'documentation.revision', params };
            },
        },
        {
            name    : 'documentation.revision',
            path    : '/documentation/:project/:revision',
            redirect: async (state, router) => {
                let params   = { project: state.params.project, revision: state.params.revision, document: 'index' };
                let project  = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
                // if ( ! project ) {return <ErrorPage {...props} routeState={routeState} title='Project not found' message={<p>Could not find the project [{params.project}]</p>}/>;                }
                let revision = project.revisions.find(r => r.key === params.revision);
                // if ( ! revision ) { return <ErrorPage {...props} routeState={routeState} title="Revision not found" message={<p>Could not find revision [{params.revision}] in project [{project.key}]</p>}/>; }
                return { name: 'documentation.document', params };
            },
        },
        {
            name         : 'documentation.document',
            path         : '/documentation/:project/:revision/:document+',
            loadComponent: async () => import(/* webpackChunkName: "core.pages.document" */'./pages/DocumentPage'),
            canEnter     : async (state) => {
                let params  = state.params;
                let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
                if ( ! project ) {
                    return false; //<ErrorPage {...props} routeState={routeState} title='Project not found' message={<p>Could not find the project [{params.project}]</p>}/>;
                }
                let revision = project.revisions.find(r => r.key === params.revision);
                if ( ! revision ) {
                    return false; //<ErrorPage {...props} routeState={routeState} title="Revision not found" message={<p>Could not find revision [{params.revision}] in project [{project.key}]</p>}/>;
                }
            },
        },
    );
});

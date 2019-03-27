import React from 'react';

import { configure } from 'mobx';
import { app } from 'ioc';
import { MenuPlugin } from 'menus';
import { RouterPlugin } from 'router';
import { ColorElement } from 'elements';
import { NotFoundPage } from 'pages';
import { QueryError } from 'stores';


import Root from 'components/Root';
import DocumentPage from 'pages/DocumentPage';
import { TestPage } from 'pages/TestPage';

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
            name         : 'grid',
            path         : '/grid',
            loadComponent: () => import(/* webpackChunkName: "core.pages.grid" */'./pages/GridPage'),
        }, {
            name     : 'test',
            path     : '/test',
            component: TestPage,
        },
        {
            name    : 'documentation',
            path    : '/documentation',
            redirect: async (state, router) => ({ name: 'documentation.project', params: { project: BACKEND_DATA.codex.default_project } }),
        },
        {
            name    : 'documentation.project',
            path    : '/documentation/:project',
            canEnter: async (state) => {
                let { project, revision } = state.params;
                if ( ! app.store.hasProject(project) ) {
                    // return { name: 'documentation' };
                    return () => NotFoundPage.project(project);
                }
            },
            redirect: async (state, router) => {
                let { project }          = state.params;
                let { default_revision } = app.store.getProject(project);
                return { name: 'documentation.revision', params: { project, revision: default_revision } };
            },
        },
        {
            name    : 'documentation.revision',
            path    : '/documentation/:project/:revision',
            canEnter: async (state) => {
                let { project, revision } = state.params;
                if ( ! app.store.hasProject(project) ) {
                    // return { name: 'documentation' };
                    return () => NotFoundPage.project(project);
                }
                if ( ! app.store.hasRevision(project, revision) ) {
                    // return { name: 'documentation.project', params: { project } };
                    return () => NotFoundPage.revision(revision);
                }
            },
            redirect: async (state, router) => {
                let { project, revision } = state.params;
                let { default_document }  = app.store.getRevision(project, revision);
                return { name: 'documentation.document', params: { project, revision, document: default_document } };
            },
        },
        {
            name     : 'documentation.document',
            path     : '/documentation/:project/:revision/:document+',
            component: DocumentPage,
            canEnter : async (state) => {
                let { project, revision, document } = state.params;
                if ( ! app.store.hasProject(project) ) {
                    return () => NotFoundPage.project(project);
                }
                if ( ! app.store.hasRevision(project, revision) ) {
                    return () => NotFoundPage.revision(revision);
                }
            },
            enter    : async (state) => {
                let { project, revision, document } = state.params;
                try {
                    await app.store.fetchDocument(project, revision, document);
                } catch ( e ) {
                    if ( e instanceof QueryError ) {
                        app.notification.error({
                            message: e.message || e,
                        });
                    }
                    return () => NotFoundPage.document(document);
                    // return () => <ErrorPage routeState={state} title='Document not found' message={<p>{document} does not exist</p>}/>;
                }
            },
        },
    );
});

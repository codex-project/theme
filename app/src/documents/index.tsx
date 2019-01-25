///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>

import { Application, BasePlugin, Bind, Button, CLink, CodeHighlight, HtmlComponents, Icon, IsBound, Rebind, RouteLink, RouteMap, RouterPlugin, TOC, TOCHeader, TOCList, TOCListItem, Trigger, Unbind } from '@codex/core';
import { Col, Modal, Popover, Row, Tooltip } from 'antd';
import { generatePath, Redirect } from 'react-router';
import React from 'react';
import { ColorElement } from './elements';

// export * from './components';
export * from './elements';
// export * from './pages';

export interface DocumentsPluginOptions {

}

export class DocumentsPlugin extends BasePlugin<DocumentsPluginOptions> {
    name = 'documents';

    constructor() {
        super({});
    }

    register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        return undefined;
    }

    install(app: Application) {
        if ( app.plugins.has('router') ) {
            app.plugins.get('router').hooks.register.tap(this.name, routes => {
                this.registerRoutes(routes);
            });
        }
        app.hooks.registered.tap(this.name, app => {
            const components = app.get<HtmlComponents>('components');
            components.registerMap({
                'c-code-highlight': CodeHighlight,
                'c-toc'           : TOC,
                'c-toc-list'      : TOCList,
                'c-toc-list-item' : TOCListItem,
                'c-toc-header'    : TOCHeader,
                'c-link'          : CLink,

                'link'   : RouteLink,
                'trigger': Trigger,
                'modal'  : Modal,
                'icon'   : Icon as any,
                'col'    : Col,
                'row'    : Row,
                'button' : Button,
                'tooltip': Tooltip,
                'popover': Popover,
            });
        });

        customElements.define(ColorElement.TAG, ColorElement);
    }

    protected registerRoutes(routes: RouteMap) {
        routes.push(
            {
                name  : 'home',
                path  : '/',
                action: async (props, routeState) => {
                    let promise    = new Promise((resolve, reject) => setTimeout(() => resolve({ home: 'ok' }), 500));
                    let result     = await promise;
                    const HomePage = (await import('./pages/HomePage')).default;
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
                        return React.createElement((await import('../documents/pages/ErrorPage')).default, {
                            ...props,
                            routeState,
                            title  : 'Project not found',
                            message: <p>Could not find the project using project id: [{params.project}]</p>,
                        });
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
                        return React.createElement((await import('../documents/pages/ErrorPage')).default, {
                            ...props,
                            routeState,
                            title  : 'Project not found',
                            message: <p>Could not find the project [{params.project}]</p>,
                        });
                    }
                    let revision = project.revisions.find(r => r.key === params.revision);
                    if ( ! revision ) {
                        return React.createElement((await import('../documents/pages/ErrorPage')).default, {
                            ...props,
                            routeState,
                            title  : 'Revision not found',
                            message: <p>Could not find revision [{params.revision}] in project [{project.key}]</p>,
                        });
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
                        return React.createElement((await import('../documents/pages/ErrorPage')).default, {
                            ...props,
                            routeState,
                            title  : 'Project not found',
                            message: <p>Could not find the project [{params.project}]</p>,
                        });
                    }
                    let revision = project.revisions.find(r => r.key === params.revision);
                    if ( ! revision ) {
                        return React.createElement((await import('../documents/pages/ErrorPage')).default, {
                            ...props,
                            routeState,
                            title  : 'Revision not found',
                            message: <p>Could not find revision [{params.revision}] in project [{project.key}]</p>,
                        });
                    }
                    let promise     = new Promise((resolve, reject) => setTimeout(() => resolve({ document: { title: 'test', key: params.document } }), 500));
                    let result: any = await promise;
                    const Component = (await import('../documents/pages/DocumentPage')).default;
                    return <Component {...props} routeState={routeState} document={result.document}/>;
                },
            },
        );

    }
}

export default DocumentsPlugin;

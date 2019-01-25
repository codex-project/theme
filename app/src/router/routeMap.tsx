import React from 'react';
import { generatePath, match, Redirect, RouteComponentProps, RouteProps } from 'react-router';
import * as H from 'history';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

const log = require('debug')('router:routes');

export type RouteState = Partial<H.Location<any>> & Partial<match<any>> & {
    name: string
    route: Partial<RouteDefinition>
}

export type RouteComponentType<P = {}> = React.ComponentType<RouteComponentProps & P>
export type RouteActionDefnitionProps = RouteComponentProps & { routeState: RouteState }

export interface RouteDefinition extends Partial<RouteProps> {
    name: string
    path: string
    action?: (props: RouteActionDefnitionProps, routeState: RouteState) => Promise<React.ReactNode>

    component?: RouteProps['component']
    render?: RouteProps['render']
    children?: RouteProps['children']
    exact?: RouteProps['exact']
    sensitive?: RouteProps['sensitive']
    strict?: RouteProps['strict']
}

export const routeMap: Map<string, RouteDefinition> = new Map();

const routes: RouteDefinition[] = [
    {
        name  : 'home',
        path  : '/',
        exact : true,
        action: async (props) => {
            let promise     = new Promise((resolve, reject) => setTimeout(() => resolve({ home: 'ok' }), 500));
            let result      = await promise;
            const Component = (await import('./HomePage')).HomePage;
            return <Component {...props} {...result} />;
        },
    },
    {
        name  : 'documentation',
        path  : '/documentation',
        exact : true,
        action: async (props, routeState) => {
            let to = generatePath(routeMap.get('documentation.project').path, { project: BACKEND_DATA.codex.default_project });
            return <Redirect to={to}/>;
        },
    },
    {
        name  : 'documentation.project',
        path  : '/documentation/:project',
        exact : true,
        action: async (props, routeState) => {
            let params  = { project: routeState.params.project, revision: 'master' };
            let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
            if ( ! project ) {
                return React.createElement((await import('./ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Project not found',
                    message: <p>Could not find the project using project id: [{params.project}]</p>,
                });
            }
            let to = generatePath(routeMap.get('documentation.revision').path, params);
            return <Redirect to={to}/>;
        },
    },
    {
        name  : 'documentation.revision',
        path  : '/documentation/:project/:revision',
        exact : true,
        action: async (props, routeState) => {
            let params = { project: routeState.params.project, revision: routeState.params.revision, document: 'index' };
            let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
            if ( ! project ) {
                return React.createElement((await import('./ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Project not found',
                    message: <p>Could not find the project [{params.project}]</p>,
                });
            }
            let revision = project.revisions.find(r=>r.key === params.revision);
            if ( ! revision ) {
                return React.createElement((await import('./ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Revision not found',
                    message: <p>Could not find revision [{params.revision}] in project [{project.key}]</p>,
                });
            }
            let to = generatePath(routeMap.get('documentation.document').path, params);
            return <Redirect to={to}/>;
        },
    },
    {
        name  : 'documentation.document',
        path  : '/documentation/:project/:revision/:document+',
        exact : true,
        action: async (props, routeState) => {

            let params = routeState.params;
            let project = BACKEND_DATA.codex.projects.find(p => p.key === params.project);
            if ( ! project ) {
                return React.createElement((await import('./ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Project not found',
                    message: <p>Could not find the project [{params.project}]</p>,
                });
            }
            let revision = project.revisions.find(r=>r.key === params.revision);
            if ( ! revision ) {
                return React.createElement((await import('./ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Revision not found',
                    message: <p>Could not find revision [{params.revision}] in project [{project.key}]</p>,
                });
            }
            let promise     = new Promise((resolve, reject) => setTimeout(() => resolve({ document: {title: 'test', key: params.document } }), 500));
            let document = await promise;
            const Component = (await import('./DocumentPage')).DocumentPage;
            return <Component {...props} routeState={routeState} document={document} />;
        },
    },
];
routes.forEach(route => routeMap.set(route.name, route));

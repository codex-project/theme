import { RouteDefinition } from './router/types';
import { generatePath, Redirect } from 'react-router';
import React from 'react';
import { RouteMap } from './router/RouteMap';

const routeDefaults = (): Partial<RouteDefinition> => ({
    exact     : true,
    transition: true,
    loader    : true,
});

export const routes: RouteMap = new RouteMap();

const _routes: RouteDefinition[] = [
    {
        name  : 'home',
        path  : '/',
        action: async (props) => {
            let promise    = new Promise((resolve, reject) => setTimeout(() => resolve({ home: 'ok' }), 500));
            let result     = await promise;
            const HomePage = (await import('./pages/HomePage')).HomePage;
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
                return React.createElement((await import('./pages/ErrorPage')).ErrorPage, {
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
                return React.createElement((await import('./pages/ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Project not found',
                    message: <p>Could not find the project [{params.project}]</p>,
                });
            }
            let revision = project.revisions.find(r => r.key === params.revision);
            if ( ! revision ) {
                return React.createElement((await import('./pages/ErrorPage')).ErrorPage, {
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
                return React.createElement((await import('./pages/ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Project not found',
                    message: <p>Could not find the project [{params.project}]</p>,
                });
            }
            let revision = project.revisions.find(r => r.key === params.revision);
            if ( ! revision ) {
                return React.createElement((await import('./pages/ErrorPage')).ErrorPage, {
                    ...props,
                    routeState,
                    title  : 'Revision not found',
                    message: <p>Could not find revision [{params.revision}] in project [{project.key}]</p>,
                });
            }
            let promise     = new Promise((resolve, reject) => setTimeout(() => resolve({ document: { title: 'test', key: params.document } }), 500));
            let result:any    = await promise;
            const Component = (await import('./pages/DocumentPage')).DocumentPage;
            return <Component {...props} routeState={routeState} document={result.document}/>;
        },
    },
];
_routes.forEach(route => routes.set(route.name, { ...routeDefaults(), ...route }));

import { createRouter, PluginFactory, Route, Router, transitionPath } from 'router5';
import { MiddlewareFactory } from 'router5/types/types/router';
import browserPluginFactory from 'router5-plugin-browser';
import loggerPlugin from 'router5-plugin-logger';
import listenersPluginFactory from 'router5-plugin-listeners';
import * as  url from 'utils/url';
import { routeNode } from 'react-router5';

const log           = require('debug')('routing');
let routes: Route[] = [
    {
        name      : 'home',
        path      : url.root(),
        onActivate: async (toState, fromState) => {
            log('home onActivate', { toState, fromState });
            let promise = new Promise((resolve, reject) => setTimeout(resolve, 500));
            await promise;
            log('home onActivate done', { toState, fromState, promise });
        },
    },
    {
        name    : 'documentation',
        path    : url.documentation(),
        children: [
            {
                name: 'project',
                path: '/:project',
            },
            {
                name         : 'revision',
                path         : '/:project/:revision',
                loadComponent: async () => import('./DocumentationRevision'),
            },
            {
                name: 'document',
                path: '/:project/:revision/*document',

            },
        ],
    },
];


function findRoute(name, routes: any[]) {
    let segments = name.split('.');
    let segment  = segments.shift();
    let current;
    let left     = routes;
    while ( left.length ) {
        current = left[ 0 ];
        left    = left.slice(1);
        if ( current.name === segment ) {
            if ( segments.length && current.children ) {
                segment = segments.shift();
                left    = current.children;
                continue;
            }
            if ( segments.length === 0 ) {
                return current;
            }
        }
    }
}

const componentLoaderMiddlewareFactory = (routes: Route[]) => {
    const resolveLoaded = obj => obj && obj.__esModule ? obj.default : obj;

    return (router) => (toState, fromState) => {
        const { toActivate }        = transitionPath(toState, fromState);
        const loadComponentHandlers = toActivate
            .map(segment => {
                let route = findRoute(segment, routes);
                if ( route && (route.component || route.loadComponent) ) {
                    return route;
                }
            })
            .filter(Boolean);

        return Promise
            .all(loadComponentHandlers.map(async (route: Route) => {
                let component;
                if ( route.loadComponent ) {
                    component = await route.loadComponent(toState, fromState);
                } else if ( route.component ) {
                    component = route.component;
                }
                component = resolveLoaded(component);
                if ( route.wrapComponent !== false && component.name !== 'RouteNodeWrapper' ) {
                    component = routeNode(route.name)(component);
                }
                return { component };
            }))
            .then(data => {
                const routeData = data.reduce((accData, rData) => Object.assign(accData, rData), {});
                log('componentLoaderMiddlewareFactory', 'loadComponentHandlers', 'done', data, routeData);
                return { ...toState, data: routeData };
            });
    };
};


const dataMiddlewareFactory = (routes: Route[]) => (router) => (toState, fromState) => {
    const { toActivate }     = transitionPath(toState, fromState);
    const onActivateHandlers = toActivate
        .map(segment => {
            let route = findRoute(segment, routes);
            return route && route.onActivate;
        })
        .filter(Boolean);

    // log('dataMiddlewareFactory', { toActivate, onActivateHandlers, toState, fromState });
    return Promise
        .all(onActivateHandlers.map(callback => {
            let res = callback(toState, fromState);
            // log('dataMiddlewareFactory', 'onActivateHandlers', res);
            return res;
        }))
        .then(data => {
            const routeData = data.reduce((accData, rData) => Object.assign(accData, rData), {});
            // log('dataMiddlewareFactory', 'onActivateHandlers', 'done', routeData, data);
            return { ...toState, data: routeData };
        });
};

export function configureRouter(): Router {
    const router = createRouter(routes, {
        defaultRoute   : 'home',
        queryParamsMode: 'strict',
        caseSensitive  : true,
    });

    const plugins: PluginFactory[] = [
        browserPluginFactory({
            useHash: false,
            base   : BACKEND_DATA.codex.http.prefix,
        }),
        loggerPlugin,
        listenersPluginFactory({
            autoCleanUp: true,
        }),
    ];

    router.usePlugin(...plugins);

    const middlewares: MiddlewareFactory[] = [
        dataMiddlewareFactory(routes),
        componentLoaderMiddlewareFactory(routes),
    ];

    router.useMiddleware(...middlewares);

    return router;
}

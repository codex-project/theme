import { Route, Router, State, transitionPath } from 'router5';
import { routeNode } from 'react-router5';
import { RouterStore } from 'routing/RouterStore';
import React from 'react';
import { RouteNodeProps } from 'react-router5/types/render/RouteNode';

const log           = require('debug')('routing:middleware:component-loader');
const resolveLoaded = obj => obj && obj.__esModule ? obj.default : obj;

declare module 'router5/types/types/base' {
    interface State {
        component?: React.ComponentType<RouteNodeProps & any>
    }
}

declare module 'router5/types/types/router' {
    interface Route {
        /** if true then the defined Component in 'component' or 'loadComponent' will not be wrapped in a RouteNode */
        wrap?: boolean | ((component: React.ComponentType<RouteNodeProps & any>) => React.ComponentType<RouteNodeProps & any>)
        /** The component to render */
        component?: React.ComponentType<RouteNodeProps & any>
        /** You can set a loader component that shows during state transitions with async data loaders (loadComponent, onActivate, ..) */

        // loader?: () => React.ComponentType<any>

        /** Same as 'component' but with a dynamic import */
        loadComponent?(toState: State, fromState: State | null): Promise<{ [ key: string ]: React.ComponentType<RouteNodeProps & any> }>
    }
}

export const componentLoaderMiddlewareFactory = (routerStore: RouterStore) => (router: Router) => (toState: State, fromState: State | null) => {
    const { toActivate }        = transitionPath(toState, fromState);
    const loadComponentHandlers = toActivate
        .map(segment => {
            let route = routerStore.routes.get(segment);
            return route && (route.component || route.loadComponent) && route;
        })
        .filter(Boolean);

    return Promise
        .all(loadComponentHandlers.map(async (route: Route) => {
            let component: React.ComponentType<RouteNodeProps & any>;
            if ( route.loadComponent ) {
                component = resolveLoaded(await route.loadComponent(toState, fromState));
            } else if ( route.component ) {
                component = route.component;
            }
            if ( typeof route.wrap !== 'undefined' && component.name !== 'RouteNodeWrapper' ) {
                let wrapped: React.ComponentType<RouteNodeProps & any>;
                if ( typeof route.wrap === 'function' ) {
                    wrapped = routeNode(route.name)(route.wrap(component));
                } else {
                    wrapped = routeNode(route.name)(component);
                }
                component[ 'WrappedComponent' ] = wrapped;
                component[ 'routeName' ]        = route.name;
                component                       = wrapped;
            }

            return { component };
        }))
        .then((value: { component: any }[]) => {
            if ( ! value || ! value[ 0 ] || ! value[ 0 ].component ) {
                return { ...toState };
            }
            log('componentLoaderMiddlewareFactory', 'done', { value, component: value[ 0 ].component });
            return { ...toState, component: value[ 0 ].component };
        });

};




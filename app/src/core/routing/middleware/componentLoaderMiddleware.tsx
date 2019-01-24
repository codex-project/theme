import { Route, Router, State, transitionPath } from 'router5';
import { routeNode } from 'react-router5';
import { IRouteMap } from 'routing/types';

const log = require('debug')('routing:middleware:component-loader');

export const componentLoaderMiddlewareFactory = (routes: IRouteMap) => {
    const resolveLoaded = obj => obj && obj.__esModule ? obj.default : obj;

    return (router: Router) => (toState: State, fromState: State | null) => {
        const { data }              = router.getDependencies();
        const { toActivate }        = transitionPath(toState, fromState);
        const loadComponentHandlers = toActivate
            .map(segment => {
                // let route = findRoute(segment, routes);
                let route = routes.get(segment); //findRoute(segment, routes);
                return route && (route.component || route.loadComponent) && route;
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
                if ( route.noWrap !== true && component.name !== 'RouteNodeWrapper' ) {
                    let rcomponent                   = routeNode(route.name)(component);
                    rcomponent[ 'WrappedComponent' ] = component;
                    rcomponent[ 'routeName' ]        = route.name;
                    component                        = rcomponent;
                }

                return { component };
            }))
            .then(data => {
                // data.forEach(item => item.)
                let routeData = data.reduce((accData, rData) => Object.assign(accData, rData), {});
                log('componentLoaderMiddlewareFactory', 'loadComponentHandlers', 'done', data, routeData);
                return { ...toState, data: routeData };
            });

    };
};



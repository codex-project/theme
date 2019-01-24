import { Route, Router, transitionPath } from 'router5';
import { findRoute } from '../utils';
import { IRouteMap } from 'routing/types';

const log                    = require('debug')('routing:middleware:activate');

export const onActivateMiddlewareFactory = (routes: IRouteMap) => (router: Router) => (toState, fromState) => {
    const { data }           = router.getDependencies();
    const { toActivate }     = transitionPath(toState, fromState);
    const onActivateHandlers = toActivate
        .map(segment => {
            let route = routes.get(segment); //findRoute(segment, routes);
            return route && route.onActivate;
        })
        .filter(Boolean);

    return Promise
        .all(onActivateHandlers.map(callback => {
            let res = callback(toState, fromState);
            return res;
        }))
        .then(data => {
            const routeData = data.reduce((accData, rData) => Object.assign(accData, rData), {});
            log('dataMiddlewareFactory', 'onActivateHandlers', 'done', routeData, data);
            return { ...toState, data: routeData };
        });
};

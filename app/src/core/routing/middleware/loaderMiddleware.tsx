import { Route, Router, State, transitionPath } from 'router5';
import { merge } from 'lodash';
import { IRouteMap } from 'routing/types';

interface LoaderMiddlewareOptions {
    with?: (keyof Route)[]
}

const log = require('debug')('routing:middleware:loader');

export const loaderMiddlewareFactory = (routes: IRouteMap, options?: LoaderMiddlewareOptions) => {
    options = merge({
        with: [ 'loadComponent', 'canActivate' ],
    } as LoaderMiddlewareOptions, options);

    return (router: Router) => async (toState: State, fromState: State | null) => {
        const { toActivate } = transitionPath(toState, fromState);
        const { data }       = router.getDependencies();
        options.with.forEach(w => {});
        return { ...toState };
    };
};

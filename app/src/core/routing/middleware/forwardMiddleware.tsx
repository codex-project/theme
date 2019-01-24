import { IRouteMap } from 'routing';
import { Router, transitionPath } from 'router5';

const log                             = require('debug')('routing:middleware:forward');
export const forwardMiddlewareFactory = (routes: IRouteMap) => (router: Router) => async (toState, fromState) => {
    const { toActivate } = transitionPath(toState, fromState);
    let forwards         = Array.from(routes.values())
        .filter(r => toActivate.includes(r.name) && typeof r.forward === 'function')
        .map(r => r.forward);

    log(toState.name, { toActivate, forwards, toState, fromState });
    if ( forwards.length === 0 ) {
        return;
    }

    let forward = await forwards[ 0 ](toState, fromState);
    if ( toState.name === forward.name ) {
        return;
    }
    let path  = router.buildPath(forward.name, forward.params);
    let state = router.buildState(forward.name, forward.params);
    log(toState.name, { forward, path, state });
    router.navigate(forward.name, forward.params);
};


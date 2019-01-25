import { RouterStore } from 'routing/RouterStore';
import { Router, State, transitionPath } from 'router5';
import { MiddlewareFactory } from 'router5/types/types/router';
import { LinkData } from 'routing';

declare module 'router5/types/types/router' {
    interface Route {
        forward?(toState: State, fromState: State | null): Promise<any>

    }
}
const log                             = require('debug')('routing:middleware:forward');
export const forwardMiddlewareFactory = (routerStore: RouterStore): MiddlewareFactory => (router: Router) => (toState, fromState, done) => {
    const { toActivate, intersection } = transitionPath(toState, fromState);
    if ( ! routerStore.routes.has(toState.name) ) {
        return done(null);
    }
    let route = routerStore.routes.get(toState.name);
    if ( typeof route.forward !== 'function' ) {
        return done(null);
    }

    log(toState.name, { toActivate, intersection, route, toState, fromState });

    route.forward(toState, fromState)
        .catch(err => done(err))
        .then(forward => {
            if(!forward){
                return done(null)
            }
            if ( toState.name === forward.name ) {
                return done(null);
            }
            let path  = router.buildPath(forward.name, forward.params);
            let state = router.buildState(forward.name, forward.params);
            log(toState.name, { forward, path, state });
            router.navigate(forward.name, forward.params);
            // done(null, {redirect: });
        });

};


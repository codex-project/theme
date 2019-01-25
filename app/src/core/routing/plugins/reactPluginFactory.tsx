import { Plugin, PluginFactory, Route, Router, State } from 'router5';
import { LinkData, RouterStore } from 'routing';
import { runInAction } from 'mobx';
import { storePluginFactory } from 'routing/plugins/storePluginFactory';
import { transitionPluginFactory } from 'routing/plugins/transitionPluginFactory';
import { dataLoaderMiddlewareFactory } from 'routing/middleware/dataLoaderMiddleware';
import { componentLoaderMiddlewareFactory } from 'routing/middleware/componentLoaderMiddleware';
import { forwardMiddlewareFactory } from 'routing/middleware/forwardMiddleware';

declare module 'react-router5/types/types' {
    interface RouteState {
        route: State
        previousRoute: State | null
    }
}
declare module 'router5/types/types/router' {

    interface Route {
        store?: RouterStore
        router?: Router

        /** Configure a transition animation for enter/leave */
        transition?: any

        link?(params?: any, overrides?: any): LinkData

    }

    interface Router {
        setRoute(name: string, route: Route): Route

        hasRoute(name: string): boolean

        getRoute(name: string): Route

        getRouteLink(name: string, params?: any, overrides?: any): LinkData
    }
}


export const reactPluginFactory = (options: {
    store: RouterStore
}): PluginFactory => {
    options       = {
        ...options,
    };
    let { store } = options;
    return (router, dependencies): Plugin => {
        // router.usePlugin(storePluginFactory({
        //     wrapperFn     : runInAction,
        //     restore       : id => store.callRestoreListeners(id),
        //     save          : id => store.callRestoreListeners(id),
        //     historyPop    : () => store.history.pop(),
        //     historyPush   : state => store.history.push(state),
        //     historyReplace: state => store.history[ store.history.length - 1 ] = state,
        //     setCurrent    : state => store.current = state,
        //     getRoute      : name => store.routes.get(name),
        // }));
        router.usePlugin(transitionPluginFactory(store));
        router.useMiddleware(
            dataLoaderMiddlewareFactory(store),
            componentLoaderMiddlewareFactory(store),
            forwardMiddlewareFactory(store),
        );
        let add     = router.add;
        let addNode = router.addNode;

        router.hasRoute     = (name: string) => store.routes.has(name);
        router.getRoute     = (name: string) => store.routes.get(name);
        router.getRouteLink = (name: string, params = {}, overrides = {}) => {
            let route = router.getRoute(name);
            if ( route && typeof route.link === 'function' ) {
                return route.link(params, overrides);
            }
            return { name };
        };


        return {
            onStart(): void {

            },
            onStop(): void {

            },
            teardown(): void {

            },
        };
    };
};

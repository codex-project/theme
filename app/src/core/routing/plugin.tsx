import { BasePlugin } from 'classes/Plugin';
import { Application } from 'classes/Application';
import { createRouter, Dependencies, Options, PluginFactory, Router, State } from 'router5';
import { SyncHook } from 'tapable';
import { RouterStore } from 'routing/RouterStore';
import { DictionaryWrapper } from 'collections/DictionaryWrapper';
import browserPluginFactory from 'router5-plugin-browser';
import listenersPluginFactory from 'router5-plugin-listeners';
import { MiddlewareFactory } from 'router5/types/types/router';
import { IRouteMap, LinkData, Route } from 'routing/types';
import { app } from 'ioc';
import React from 'react';
import { reactPluginFactory } from 'routing/plugins/reactPluginFactory';
import { loggerPluginFactory } from 'routing/plugins/loggerPluginFactory';
import { SimpleBrowser } from 'routing/browser';
import { HistoryState } from 'router5-plugin-browser/types/types';
import { toJS } from 'mobx';
import { RouteMap } from 'routing/RouteMap.js';

declare module 'router5/types/types/router' {
    interface Route {
        store?: RouterStore
        router?: Router

        /** Configure a transition animation for enter/leave */
        transition?: any

        link?(params?: any, overrides?: any): LinkData
    }
}


export interface RouterPluginOptions extends Partial<Options> {
    routes?: Route[]
    startPathOrState?: () => string | State
}

export class RouterPlugin extends BasePlugin<RouterPluginOptions> {
    name = 'router';
    hooks: {
        register: SyncHook<RouteMap, Partial<Options>>
        registered: SyncHook<RouterStore, Router>
    }    = {
        register  : new SyncHook([ 'routeMap', 'routerOptions' ]),
        registered: new SyncHook([ 'routerStore', 'router' ]),
    };

    constructor(options: RouterPluginOptions = {}) {
        super({
            routes         : [],
            queryParamsMode: 'strict',
            caseSensitive  : true,
            ...options,
        });
        this.hooks.register.tap(this.name, (routeMap) => {
            this.options.routes.forEach(route => routeMap.set(route.name, route));
        });
        this.hooks.registered.tap(this.name, (routerStore, router) => {
            routerStore.routes.forEach(route => {
                route.store  = routerStore;
                route.router = routerStore.router;
            });

            const data                       = new DictionaryWrapper({});
            const dependencies: Dependencies = {
                data,
                store: routerStore,
            };

            function getHistoryState(state: HistoryState) {
                let { component, data, ...historyState } = state;
                historyState                             = toJS(historyState, {
                    exportMapsAsObjects: true,
                    recurseEverything  : true,
                });
                return historyState;
            }

            const plugins: PluginFactory[]         = [
                browserPluginFactory({
                    useHash: false,
                    base   : app.store.codex.http.prefix,
                }, {
                    ...SimpleBrowser,
                    pushState(state: HistoryState, title: string | null, path: string): void {
                        SimpleBrowser.pushState(getHistoryState(state), title, path);
                    },
                    replaceState(state: HistoryState, title: string | null, path: string): void {
                        SimpleBrowser.replaceState(getHistoryState(state), title, path);
                    },
                }),
                loggerPluginFactory(),
                listenersPluginFactory({
                    autoCleanUp: true,
                }),
                reactPluginFactory({ store: routerStore }),
            ].filter(Boolean);
            const middlewares: MiddlewareFactory[] = [];

            router.setDependencies(dependencies);
            router.usePlugin(...plugins);
            router.useMiddleware(...middlewares);

        });
    }

    install(app: Application) {
        let { routes, ...routerOptions } = this.options;
        let routeMap: IRouteMap          = new RouteMap();
        app.hooks.register.tap(this.name, (app) => {
            this.hooks.register.call(routeMap, routerOptions);

            const routes      = Array.from(routeMap.values());
            const router      = createRouter(routes, {
                defaultRoute   : 'home',
                queryParamsMode: 'strict',
                caseSensitive  : true,
                ...routerOptions,
            });
            const routerStore = new RouterStore(routeMap, router);

            app.bind('routes').toConstantValue(routeMap);
            app.bind('router').toConstantValue(router);
            app.bind('store.router').toConstantValue(routerStore);
        });
        app.hooks.registered.tap(this.name, app => {
            let routerStore = app.get<RouterStore>('store.router');
            let router      = app.get<Router>('router');
            this.hooks.registered.call(routerStore, router);
        });

        app.hooks.booted.tap(this.name, app => {
            app.router.start(this.options.startPathOrState ? this.options.startPathOrState() : undefined);
        });
    }
}

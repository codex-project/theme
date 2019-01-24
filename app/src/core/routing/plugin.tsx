import { BasePlugin } from 'classes/Plugin';
import { Application } from 'classes/Application';
import { createRouter, Dependencies, Options, PluginFactory } from 'router5';
import { SyncHook } from 'tapable';
import { RouterStore } from 'routing/RouterStore';
import { DictionaryWrapper } from 'collections/DictionaryWrapper';
import browserPluginFactory from 'router5-plugin-browser';
import loggerPlugin from 'router5-plugin-logger';
import listenersPluginFactory from 'router5-plugin-listeners';
import { mobxPluginFactory } from 'routing/plugins/mobxPluginFactory';
import { transitionPluginFactory } from 'routing/plugins/transitionPlugin';
import { MiddlewareFactory } from 'router5/types/types/router';
import { onActivateMiddlewareFactory } from 'routing/middleware/onActivateMiddleware';
import { componentLoaderMiddlewareFactory } from 'routing/middleware/componentLoaderMiddleware';
import { loaderMiddlewareFactory } from 'routing/middleware/loaderMiddleware';
import { forwardMiddlewareFactory } from 'routing/middleware/forwardMiddleware';
import { Route,IRouteMap } from 'routing/types';

export interface RouterPluginOptions extends Partial<Options> {
    routes?: Route[]
}

export class RouterPlugin extends BasePlugin<RouterPluginOptions> {
    name  = 'router';
    hooks = {
        register: new SyncHook<IRouteMap, Partial<Options>>([ 'routeMap', 'routerOptions' ]),
    };

    constructor(options:RouterPluginOptions={}) {
        super({
            routes         : [],
            defaultRoute   : 'home',
            queryParamsMode: 'strict',
            caseSensitive  : true,
            ...options,
        });
    }

    install(app: Application) {
        let { routes, ...routerOptions } = this.options;
        let routeMap: IRouteMap          = new Map();
        this.hooks.register.tap(this.name, (routeMap) => {
            routes.forEach(route => routeMap.set(route.name, route));
        });
        app.hooks.registered.tap(this.name, (app) => {
            this.hooks.register.call(routeMap, routerOptions);

            const routes      = Array.from(routeMap.values());
            const router      = createRouter(routes, {
                defaultRoute   : 'home',
                queryParamsMode: 'strict',
                caseSensitive  : true,
                ...routerOptions,
            });
            const routerStore = new RouterStore(routeMap, router);

            const dependencies: Dependencies = {
                data: new DictionaryWrapper({}),
            };

            const plugins: PluginFactory[] = [
                browserPluginFactory({
                    useHash: false,
                    base   : BACKEND_DATA.codex.http.prefix,
                }),
                loggerPlugin,
                listenersPluginFactory({
                    autoCleanUp: true,
                }),
                mobxPluginFactory(routeMap, routerStore),
                transitionPluginFactory(routerStore),
            ];

            const middlewares: MiddlewareFactory[] = [
                onActivateMiddlewareFactory(routeMap),
                componentLoaderMiddlewareFactory(routeMap),
                loaderMiddlewareFactory(routeMap, {
                    with: [ 'loadComponent', 'canActivate' ],
                }),
                forwardMiddlewareFactory(routeMap),
            ];

            router.setDependencies(dependencies);
            router.usePlugin(...plugins);
            router.useMiddleware(...middlewares);

            app.bind('routes').toConstantValue(routeMap);
            app.bind('router').toConstantValue(router);
            app.bind('store.router').toConstantValue(routerStore);
        });

        app.hooks.booted.tap(this.name, app => {
            app.router.start();
        });
    }
}

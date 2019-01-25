import { SyncHook, SyncWaterfallHook } from 'tapable';
import { Application } from 'classes/Application';
import { RouteDefinition, RouterOptions } from './types';
import { Router } from './Router';
import { BasePlugin, Bind, IsBound, Rebind, Unbind } from 'classes/Plugin';
import { interfaces } from 'inversify';

export * from './Router';
export * from './RouteMap';
export * from './types';

export interface RouterPluginOptions extends RouterOptions {
    routes?: RouteDefinition[]
}

export class RouterPlugin extends BasePlugin<Partial<RouterPluginOptions>> {
    name = 'router';
    hooks: {
        register: SyncWaterfallHook<RouterOptions>
        registered: SyncHook<Router>
    }    = {
        register  : new SyncWaterfallHook([ 'routerOptions' ]),
        registered: new SyncHook([ 'router' ]),
    };

    constructor(protected options: RouterPluginOptions = {} as any) {
        super({
            routes: [],
            ...options,
        });
    }

    async register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        bind('router.factory').toFactory(ctx => {
            return (routerOptions: RouterOptions) => {
                return new Router(routerOptions);
            };
        });
    }

    install(app: Application) {
        app.hooks.register.tap(this.name, (app) => {
            let { routes, ...routerOptions } = this.options;
            routerOptions                    = this.hooks.register.call(routerOptions);
            const routerFactory              = app.get<interfaces.Factory<Router>>('router.factory');
            const router                     = routerFactory(routerOptions) as Router;
            app.bind('router').toConstantValue(router);
            this.options.routes.forEach(route => router.setRoute(route.name, route));
        });
        app.hooks.registered.tap(this.name, app => {
            const router = app.get<Router>('router');
            this.hooks.registered.call(router);
        });
        app.hooks.booted.tap(this.name, app => {
            const router = app.get<Router>('router');
            router.start();
        });
    }
}

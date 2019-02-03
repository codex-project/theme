
import { RouteMap } from './RouteMap';
import { Router } from './Router';
import { SyncHook } from 'tapable';
import createBrowserHistory, { BrowserHistoryBuildOptions } from 'history/createBrowserHistory';
import { LocationDescriptorObject } from 'history';
import { RouteDefinition, RouteDefinitionTestKeys } from './types';
import pathToRegexp from 'path-to-regexp';
import { Application } from 'classes/Application';
import { BasePlugin, Bind, IsBound, Rebind, Unbind } from 'classes/Plugin';
import { merge } from 'lodash';

const addTestKeysToRoute = (route: RouteDefinition): RouteDefinition & RouteDefinitionTestKeys => {
    try {
        (route as any).keys   = [];
        (route as any).test   = pathToRegexp(route.path, (route as any).keys);
        (route as any).toPath = pathToRegexp.compile(route.path.toString());
        // route.parsed = pathToRegexp.parse(route.path.toString())
    } catch ( e ) {
        console.warn('setRoutes', e);
    }
    return route;
};


export interface RouterPluginOptions {
    historyOptions?: BrowserHistoryBuildOptions
    routeDefaults?: () => Partial<RouteDefinition>
    defaultRoute: string | LocationDescriptorObject
}

export class RouterPlugin extends BasePlugin<Partial<RouterPluginOptions>> {
    name                             = 'router';
    hooks: {
        register: SyncHook<RouteMap>
        registered: SyncHook<RouteMap>


    }                                = {
        register  : new SyncHook([ 'routes' ]),
        registered: new SyncHook([ 'routes' ]),
    };
    public readonly routes: RouteMap = new RouteMap();

    constructor(protected options: RouterPluginOptions = {} as any) {
        super(options);

        this.options = merge({}, {
            historyOptions: {},
            routeDefaults : (): Partial<RouteDefinition> => ({
                exact     : true,
                transition: true,
                loader    : true,
            }),
        }, options);

        this.routes.hooks.set.tap(this.name, route => {
            // let { error, value } = validate<any>({ route }, schema);
            // if ( error ) { throw error;}
            return addTestKeysToRoute({ ...this.options.routeDefaults(), ...route });
        });
    }

    async register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        bind('routes').toConstantValue(this.routes);
    }

    install(app: Application) {
        app.hooks.register.tap(this.name, (app) => {
            let { historyOptions, defaultRoute, ...routerOptions } = this.options;
            this.hooks.register.call(this.routes);
            const history       = createBrowserHistory(historyOptions);
            this.routes.history = history;
            app.renderWrappers.add([ Router, { history } ]);
            app.bind('history').toConstantValue(history);
        });
        app.hooks.registered.tap(this.name, app => {
            this.hooks.registered.call(this.routes);
        });
        app.hooks.booted.tap(this.name, app => {
            app.get('history').listen((location, action) => {
                this.routes.hooks.transition.call(location, action);
            })
        })
    }
}

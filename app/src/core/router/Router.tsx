import * as H from 'history';
import { Dispatcher } from 'classes/Dispatcher';
import { injectable } from 'ioc';
import React from 'react';
import { RouteMap } from 'router/RouteMap';
import { DefinedRoute, NavigateOptions, Params, PatternBuildOptions, PatternMatchOptions, RouteDefinition, RouterOptions } from './types';
import Path from 'path-parser';
import { SyncHook } from 'tapable';
import { observable } from 'mobx';


const log = require('debug')('Router');

@injectable()
export class Router {
    public readonly hooks = {
        start  : new SyncHook<this>([ 'router' ]),
        started: new SyncHook<this>([ 'router' ]),
    };
    public readonly history: H.History;
    public readonly routes: RouteMap;
    public readonly options: RouterOptions;
    public readonly current: H.Location;

    protected started: boolean = false;
    protected events: Dispatcher;


    constructor(options: RouterOptions = {}) {
        this.options = {
            createBrowser: (options) => H.createBrowserHistory(options),
            ...options,
        };

        const { basename, forceRefresh, getUserConfirmation } = this.options;

        this.history = this.options.createBrowser({ basename, forceRefresh, getUserConfirmation });
        this.current = observable(this.history.location);
        this.events  = new Dispatcher();
        this.routes  = new RouteMap();
        this.routes.hooks.set.tap('Router', (route: DefinedRoute) => {
            // let getters = {
            //     get pattern(): Path { return new Path(route.path); },
            // }
            // route.pattern = getters.pattern;
            route = {
                ...route,
                get pattern(): Path { return new Path(route.path); },
            } as DefinedRoute;
            return route;
        });
    }

    start() {
        if ( this.started ) {
            throw new Error('Cannot start router multiple times');
        }
        this.hooks.start.call(this);
        log('start', { current: this.current });
        if ( this.options.defaultRoute ) {
            let location = this.buildLocationFromRoute(this.options.defaultRoute, this.options.defaultParams || {});
            log('start buildLocationFromRoute', { location });
        } else if ( this.hasMatch(this.current.pathname) ) {
            let location = this.buildLocationFromPath(this.current.pathname);
            log('start buildLocationFromPath', { location });
        }
        this.started = true;
        log('started', this);
        this.hooks.started.call(this);
        return this;
    }

    protected buildLocationFromRoute(routeName: string, params?: Params, options: PatternBuildOptions = {}) {
        options      = {
            ...this.options.building,
            ...options,
        };
        let route    = this.getRoute(this.options.defaultRoute);
        let pathname = route.pattern.build(this.options.defaultParams, options);
        let location = {
            pathname,
            state: {
                params,
                options,
            },
        };
        return location;
    }

    protected buildLocationFromPath(path: string, options: PatternMatchOptions = {}) {
        if ( ! this.hasMatch(path) ) {
            throw new Error(`Cannot navigate to route "${name}". Route is not defined.`);
        }
        options      = {
            ...this.options.matching,
            ...options,
        };
        let route    = this.matchFirst(path, options);
        let params   = route.pattern.test(path, this.options.matching);
        let pathname = route.pattern.build(params);
        let location = {
            pathname,
            state: {
                params,
                options,
            },
        };
        return location;
    }

    navigate(name: string, params?: Params, options: NavigateOptions = {}) {
        if ( ! this.hasRoute(name) ) {
            throw new Error(`Cannot navigate to route "${name}". Route is not defined.`);
        }
        options        = {
            ...this.options.building,
            ...options,
        };
        const route    = this.getRoute(name);
        const pathname = route.pattern.build(params, options);
        const location = { pathname, state: { params, options } };
        if ( options.replace ) {
            this.history.replace(location);
            return;
        }
        this.history.push(location);
    }

    getRoute(name: string): DefinedRoute { return this.routes.get(name); }

    hasRoute(name: string): boolean { return this.routes.has(name); }

    setRoute(name: string, route: RouteDefinition, override: boolean = false): this {
        this.routes.set(name, route, override);
        return this;
    }

    hasMatch(url, opts?: PatternMatchOptions): boolean {return this.match(url, opts).length > 0;}

    matchFirst(url, opts?: PatternMatchOptions): DefinedRoute | undefined {
        let matches = this.match(url, opts);
        return matches.length > 0 ? matches[ 0 ] : undefined;
    }

    match(url, opts?: PatternMatchOptions): DefinedRoute[] {
        return this.getRoutes()
            .filter(route => route.pattern.test(url, opts));
    }

    getRoutes(): DefinedRoute[] { return Array.from(this.routes.values()); }

}

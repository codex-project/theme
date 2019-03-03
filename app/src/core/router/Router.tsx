import { EventEmitter } from 'events';
import { SyncHook } from 'tapable';
import { Map } from 'immutable';
import pathToRegexp from 'path-to-regexp';
import { Match, matchPath } from './utils';
import { State, Transition } from './Transition';
import { Location, Route, To } from './interfaces';
import { injectable } from 'inversify';
import { computed, observable, runInAction, toJS } from 'mobx';
import loadable from '@loadable/component';
import { createBrowserHistory, LocationDescriptorObject } from 'history';

const log = require('debug')('router:Router');

@injectable()
export class Router extends EventEmitter {
    public readonly hooks                                           = {
        start     : new SyncHook(),
        stop      : new SyncHook(),
        transition: new SyncHook<Transition>([ 'transition' ]),
    };
    history: History & { entries: Array<LocationDescriptorObject> } = createBrowserHistory({}) as any;

    @observable location: Location = null;
    @observable started            = false;
    @observable current: State     = null;

    @computed get transitioning(): boolean {
        if ( ! this.transition ) {
            return false;
        }
        if ( this.transition.canceled || this.transition.forwarded || this.transition.finished ) {
            return false;
        }
        return true;
    }

    routes: Map<string, Route>        = Map<string, Route>();
    protected transition?: Transition = null;


    protected createTransition(routeName: string, params: any = {}, options?: { replace?: boolean, push?: boolean, pop?: boolean }): Transition {
        let transition  = new Transition(this, options);
        transition.from = toJS(this.current);
        transition.to   = this.buildState(routeName, params);
        return transition;
    }

    protected buildState(routeName, params: any = {}) {
        let state    = new State();
        state.name   = routeName;
        state.params = params;
        state.url    = this.buildUrl(routeName, params);
        state.route  = this.routes.get(routeName);
        return state;
    }

    protected runTransition(transition: Transition) {
        if ( this.transition && ! this.transition.finished ) {
            this.transition.cancel();
        }
        this.transition = transition;
        this.hooks.transition.call(transition);
        log('start transition', transition);
        this.transition.start();
    }

    navigate(routeName: string, routeParams: object = {}, options?: { push?: boolean, replace?: boolean }) {
        log('navigate', routeName, routeParams, options);
        let transition = this.createTransition(routeName, routeParams, options);
        this.runTransition(transition);
    }

    navigateTo(to: To, options?: { push?: boolean, replace?: boolean }) {
        let match = this.matchPath(this.toUrl(to));
        this.navigate(match.name, match.params, options);
    }

    go(n: number) {
        this.history.go(n);
    }

    start(defaultRoute: any = this.history.location.pathname) {
        if ( this.started ) throw Error('Router already started');
        log('start', this);
        this.hooks.start.call();

        if ( this.routes.has(defaultRoute) ) {
            defaultRoute = this.buildUrl(defaultRoute);
        }
        let match = this.matchPath(defaultRoute);

        if ( this.history.location.pathname !== '/' ) {
            let _match = this.matchPath(this.history.location.pathname);
            if ( _match ) {
                match = _match;
            }
        }

        let state    = this.buildState(match.name, match.params);
        this.started = true;
        this.history.listen((location, action) => {
            log(action, 'location', location);
            runInAction(() => this.location = location);
            if ( action === 'POP' ) {
                let match      = this.matchPath(location.pathname);
                let transition = this.createTransition(match.name, match.params, { pop: true });
                this.runTransition(transition);
            }
        });
        this.navigate(state.name, state.params);
    }

    stop() {
        log('stop', this);
        this.started = false;
        this.hooks.stop.call();
        this.emit('stop');
    }

    addRoute(route: Route) {
        route = {
            exact: true,
            ...route,
        };
        if ( route.loadComponent ) {
            route.component = loadable(() => route.loadComponent());
        }
        this.routes = this.routes.set(route.name, route);
        return this;
    }

    addRoutes(...routes: Route[]) {
        routes.forEach(route => this.addRoute(route));
    }

    buildUrl(routeName: string, routeParams: object = {}) {
        let route  = this.routes.get(routeName);
        let tokens = pathToRegexp.parse(route.path);
        let fn     = pathToRegexp.tokensToFunction(tokens);
        let url    = fn(routeParams);
        return decodeURIComponent(url);
    }

    matchPath<Params extends { [K in keyof Params]?: string } = {}>(pathname): Match<Params> {
        let routesByPath = this.routes.mapKeys((k, v) => v.path);
        let matches      = this.routes
            .map(route => matchPath<Params>(pathname, {
                path     : route.path,
                exact    : route.exact,
                sensitive: route.sensitive,
                strict   : route.strict,
            }))
            .toArray()
            .filter(Boolean)
            .map(match => {
                let route = routesByPath.get(match.path);
                return { ...match, name: route.name };
            });
        if ( matches[ 0 ] ) {
            matches[ 0 ].url = decodeURIComponent(matches[ 0 ].url);
        }
        return matches[ 0 ];
    }

    toUrl(to: To): string {
        if ( typeof to === 'string' && this.routes.has(to) ) {
            return this.buildUrl(to);
        }
        if ( typeof to === 'string' ) {
            let match = this.matchPath(to);
            if ( match ) {
                return match.url;
            }
        }
        if ( typeof to === 'object' && typeof (to as any).name === 'string' ) {
            return this.buildUrl((to as any).name, (to as any).params);
        }
        if ( typeof to === 'object' && typeof (to as any).pathname === 'string' ) {
            let match = this.matchPath((to as any).pathname);
            if ( match ) {
                return match.url;
            }
        }
        if ( typeof to === 'object' && to[ 'to' ] ) {
            return this.toUrl(to[ 'to' ]);
        }
    }

}

import 'bluebird-global';
import * as H from 'history';
import { createMemoryHistory } from 'history';

import { EventEmitter } from 'events';
import { Map } from 'immutable';
import * as pathToRegexp from 'path-to-regexp';
import { SyncBailHook, SyncHook } from 'tapable';

namespace utils {

    export namespace generate {

        const cache      = {};
        const cacheLimit = 10000;
        let cacheCount   = 0;

        function compilePath(path) {
            if ( cache[ path ] ) return cache[ path ];

            const generator = pathToRegexp.compile(path);

            if ( cacheCount < cacheLimit ) {
                cache[ path ] = generator;
                cacheCount ++;
            }

            return generator;
        }

        /**
         * Public API for generating a URL pathname from a path and parameters.
         */
        export function path(path = '/', params = {}) {
            return path === '/' ? path : compilePath(path)(params, { pretty: true });
        }
    }


    export interface Match<Params extends { [K in keyof Params]?: string } = {}> {
        name: string
        params: Params;
        isExact: boolean;
        path: string;
        url: string;
    }

    export namespace match {
        const cache      = {};
        const cacheLimit = 10000;
        let cacheCount   = 0;

        function compilePath(path, options) {
            const cacheKey  = `${options.end}${options.strict}${options.sensitive}`;
            const pathCache = cache[ cacheKey ] || (cache[ cacheKey ] = {});

            if ( pathCache[ path ] ) return pathCache[ path ];

            const keys   = [];
            const regexp = pathToRegexp(path, keys, options);
            const result = { regexp, keys };

            if ( cacheCount < cacheLimit ) {
                pathCache[ path ] = result;
                cacheCount ++;
            }

            return result;
        }

        /**
         * Public API for matching a URL pathname to a path.
         */
        export function path<Params extends { [K in keyof Params]?: string } = {}>(pathname, options: string | { path?: string, exact?: boolean, strict?: boolean, sensitive?: boolean } = {}): Match<Params> {
            if ( typeof options === 'string' ) options = { path: options };

            const { path, exact = false, strict = false, sensitive = false } = options;

            const paths = [].concat(path);

            return paths.reduce((matched, path) => {
                if ( matched ) return matched;
                const { regexp, keys } = compilePath(path, {
                    end: exact,
                    strict,
                    sensitive,
                });
                const match            = regexp.exec(pathname);

                if ( ! match ) return null;

                const [ url, ...values ] = match;
                const isExact            = pathname === url;

                if ( exact && ! isExact ) return null;

                return {
                    path, // the path used to match
                    url   : path === '/' && url === '' ? '/' : url, // the matched portion of the URL
                    isExact, // whether or not we matched exactly
                    params: keys.reduce((memo, key, index) => {
                        memo[ key.name ] = values[ index ];
                        return memo;
                    }, {}),
                };
            }, null);
        }


    }
}


interface Lifecycle {
    canEnter?: (state: State) => Promise<any>
    beforeEnter?: (state: State) => Promise<any>
    enter?: (state: State) => Promise<any>
    canLeave?: (state: State) => Promise<any>
    beforeLeave?: (state: State) => Promise<any>
}


class Transition {
    public readonly hooks = {
        start   : new SyncBailHook(),
        leave   : new SyncBailHook(),
        enter   : new SyncHook(),
        finished: new SyncHook(),
        canceled: new SyncHook(),
    };

    constructor(protected router: Router, protected options: { replace?: boolean, push?: boolean } = {}) {

    }

    finished = false;
    canceled = false;
    promise: Promise<any>;

    cancel() {
        if ( ! this.canceled && ! this.finished ) {
            this.canceled = true;
            this.finished = true;
            if ( this.promise && ! this.promise.isCancelled && ! this.promise.isFulfilled ) {
                this.promise.cancel();
            }
            this.router.emit('transition.canceled', this);
            this.hooks.canceled.call();
        }
        return this.canceled;
    }

    from: State;
    to: State;

    start() {
        this.router.emit('transition.start', this);
        if ( this.hooks.start.call() !== undefined ) {
            return this.cancel();
        }

        if ( this.canceled ) {
            return;
        }
        this.promise = new Promise(async (res, rej) => {
            if ( this.from.route.canLeave ) {
                let canLeave = await this.from.route.canLeave(this.from);
                if ( canLeave !== true && canLeave !== undefined ) {
                    return this.cancel();
                }
            }
            if ( this.from.route.beforeLeave ) {
                await this.from.route.beforeLeave(this.from);
            }


            if ( this.to.route.canEnter ) {
                let canEnter = await this.to.route.canEnter(this.to);
                if ( canEnter !== true && canEnter !== undefined ) {
                    return this.cancel();
                }
            }

            if ( this.hooks.leave.call() !== undefined ) {
                return this.cancel();
            }
            this.router.emit('state.leave', this);

            if ( this.options.replace ) {
                this.router.history.replace(this.to.url);
            } else {
                this.router.history.push(this.to.url);
            }

            if ( this.to.route.beforeEnter ) {
                await this.to.route.beforeEnter(this.to);
            }
            if ( this.from.route.enter ) {
                await this.to.route.enter(this.to);
            }
            this.router.emit('state.enter', this);
            this.hooks.enter.call();
            res();
        });
        if ( this.canceled ) {
            return;
        }
        this.promise.then(() => {
            this.finished       = true;
            this.router.current = this.to;
            this.hooks.finished.call();
            this.router.emit('transition.finished', this);
        });

    }
}

interface Route extends Lifecycle {
    name: string
    path?: string
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean


    redirect?: any
    component?: any
}

class State {
    name: string;
    route: Route;
    params: object;
    url: string;
    meta: any = {};
}


type Location = string | { name: string, params?: any }

class Router extends EventEmitter {
    public readonly hooks                                               = {
        start     : new SyncHook(),
        stop      : new SyncHook(),
        transition: new SyncHook<Transition>([ 'transition' ]),
    };
    history: H.History & { entries: Array<H.LocationDescriptorObject> } = createMemoryHistory({});
    protected started                                                   = false;
    routes: Map<string, Route>                                          = Map<string, Route>();
    current: State;
    protected transition?: Transition                                   = null;


    protected createTransition(routeName: string, params: any = {}, options?: { replace?: boolean, push?: boolean }): Transition {
        let transition  = new Transition(this, options);
        transition.from = this.current;
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
        this.transition.start();
    }

    navigate(routeName: string, routeParams: object = {}, options?: { push?: boolean, replace?: boolean }) {
        let transition = this.createTransition(routeName, routeParams, options);
        this.runTransition(transition);

    }

    start() {
        if ( this.started ) throw Error('Router already started');
        this.hooks.start.call();
        let match    = this.matchPath(this.history.location.pathname);
        this.current = this.buildState(match.name, match.params);
        this.started = true;
        this.history.listen((location, action) => {
            console.dir({ location, action }, { compact: true, colors: true });
        });
        this.once('stop', () => {
            this.started = false;
        });
    }

    wait(time: number, cb) {
        this.on('stop', cb);
        setTimeout(() => this.stop(), time);
    }

    stop() {
        this.hooks.stop.call();
        this.emit('stop');
    }

    addRoute(route: Route) {
        this.routes = this.routes.set(route.name, route);
        return this;
    }

    buildUrl(routeName: string, routeParams: object = {}) {
        let route  = this.routes.get(routeName);
        let tokens = pathToRegexp.parse(route.path);
        let fn     = pathToRegexp.tokensToFunction(tokens);
        let url    = fn(routeParams);
        return url;
    }

    matchPath<Params extends { [K in keyof Params]?: string } = {}>(pathname): utils.Match<Params> {
        let routesByPath = this.routes.mapKeys((k, v) => v.path);
        let matches      = this.routes
            .map(route => utils.match.path<Params>(pathname, {
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
        return matches[ 0 ];
    }


}


let r = new Router();
r
    .addRoute({
        name       : 'home',
        path       : '/',
        beforeLeave: async () => Promise.promisify(callback => setTimeout(() => callback(console.log('beforeLeave')), 500)),
    })
    .addRoute({
        name       : 'first',
        path       : '/first/:id',
        exact      : true,
        beforeEnter: async () => {
            console.log('beforeEnter1');
            return Promise.promisify(callback => {
                console.log('beforeEnter');
                setTimeout(() => callback(null), 3000);
            })()
        },
        enter      : async () => Promise.promisify(callback => setTimeout(() => callback(console.log('enter')), 500)),
    });


r.hooks.start.tap('a', (...args) => {
    console.log('router.hook.start', ...args);
});
r.hooks.stop.tap('a', (...args) => {
    console.log('router.hook.stop', ...args);
});
r.hooks.transition.tap('a', (transition) => {
    console.log('router.hook.transition');//, transition)

    transition.hooks.leave.tap('a', (...args) => {
        console.log('router.hook.transition.hook.leave', ...args);
    });
    transition.hooks.enter.tap('a', (...args) => {
        console.log('router.hook.transition.hook.enter', ...args);
        transition.cancel();
    });
    transition.hooks.start.tap('a', (...args) => {
        console.log('router.hook.transition.hook.start', ...args);
    });
    transition.hooks.finished.tap('a', (...args) => {
        console.log('router.hook.transition.hook.finished', ...args);
    });
    transition.hooks.canceled.tap('a', (...args) => {
        console.log('router.hook.transition.hook.canceled', ...args);
    });
});


r.start();
r.navigate('first', { id: 3 });
r.wait(5000, () => {
    let h = r[ 'history' ];
    let a = { r, h };
});

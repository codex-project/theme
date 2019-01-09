'use strict';
import React from 'react';
import PropTypes from 'prop-types';

const ALL_INITIALIZERS   = [];
const READY_INITIALIZERS = [];

function isWebpackReady(getModuleIds) {
    if ( typeof __webpack_modules__ !== 'object' ) {
        return false;
    }

    return getModuleIds().every(moduleId => {
        return (
            typeof moduleId !== 'undefined' &&
            typeof __webpack_modules__[ moduleId ] !== 'undefined'
        );
    });
}

function load(loader, props?) {
    let promise = loader(props);

    let state = {
        loading: true,
        loaded : null,
        error  : null,
        promise: null
    };

    state.promise = promise.then(loaded => {
        state.loading = false;
        state.loaded  = loaded;
        return loaded;
    }).catch(err => {
        state.loading = false;
        state.error   = err;
        throw err;
    });

    return state;
}

function loadMap(obj, props?) {
    let state = {
        loading: false,
        loaded : {},
        error  : null,
        promise: null
    };

    let promises = [];

    try {
        Object.keys(obj).forEach(key => {
            let result = load(obj[ key ], props);

            if ( ! result.loading ) {
                state.loaded[ key ] = result.loaded;
                state.error         = result.error;
            } else {
                state.loading = true;
            }

            promises.push(result.promise);

            result.promise.then(res => {
                state.loaded[ key ] = res;
            }).catch(err => {
                state.error = err;
            });
        });
    } catch ( err ) {
        state.error = err;
    }

    state.promise = Promise.all(promises).then(res => {
        state.loading = false;
        return res;
    }).catch(err => {
        state.loading = false;
        throw err;
    });

    return state;
}

function resolve(obj) {
    return obj && obj.__esModule ? obj.default : obj;
}

function render(loaded, props) {
    return React.createElement(resolve(loaded), props);
}

function createLoadableComponent(loadFn, options) {
    if ( ! options.loading ) {
        throw new Error('react-loadable requires a `loading` component')
    }

    let opts = Object.assign({
        loader : null,
        loading: null,
        delay  : 200,
        timeout: null,
        render : render,
        webpack: null,
        modules: null
    }, options);

    let res = null;

    function init(props?) {
        if ( ! res ) {
            res = loadFn(opts.loader, props);
        }
        return res.promise;
    }

    ALL_INITIALIZERS.push(init);

    if ( typeof opts.webpack === 'function' ) {
        READY_INITIALIZERS.push(() => {
            if ( isWebpackReady(opts.webpack) ) {
                return init();
            }
        });
    }

    return class LoadableComponent extends React.Component<any, any> {
        private _mounted: boolean;
        private _delay: any;
        private _timeout: any;

        constructor(props) {
            super(props);
            init(props);

            this.state = {
                error    : res.error,
                pastDelay: false,
                timedOut : false,
                loading  : res.loading,
                loaded   : res.loaded
            };
        }

        static contextTypes = {
            loadable: PropTypes.shape({
                report: PropTypes.func.isRequired
            })
        };

        static preload() {
            return init();
        }

        componentWillMount() {
            this._mounted = true;
            this._loadModule();
        }

        _loadModule() {
            if ( this.context.loadable && Array.isArray(opts.modules) ) {
                opts.modules.forEach(moduleName => {
                    this.context.loadable.report(moduleName);
                });
            }

            if ( ! res.loading ) {
                return;
            }

            if ( typeof opts.delay === 'number' ) {
                if ( opts.delay === 0 ) {
                    this.setState({ pastDelay: true });
                } else {
                    this._delay = setTimeout(() => {
                        this.setState({ pastDelay: true });
                    }, opts.delay);
                }
            }

            if ( typeof opts.timeout === 'number' ) {
                this._timeout = setTimeout(() => {
                    this.setState({ timedOut: true });
                }, opts.timeout);
            }

            let update = () => {
                if ( ! this._mounted ) {
                    return;
                }

                this.setState({
                    error  : res.error,
                    loaded : res.loaded,
                    loading: res.loading
                });

                this._clearTimeouts();
            };

            res.promise.then(() => {
                update();
            }).catch(err => {
                update();
            });
        }

        componentWillUnmount() {
            this._mounted = false;
            this._clearTimeouts();
        }

        _clearTimeouts() {
            clearTimeout(this._delay);
            clearTimeout(this._timeout);
        }

        retry = () => {
            this.setState({ error: null, loading: true });
            res = loadFn(opts.loader);
            this._loadModule();
        }

        render() {
            if ( this.state.loading || this.state.error ) {
                return React.createElement(opts.loading, {
                    isLoading: this.state.loading,
                    pastDelay: this.state.pastDelay,
                    timedOut : this.state.timedOut,
                    error    : this.state.error,
                    retry    : this.retry
                });
            } else if ( this.state.loaded ) {
                return opts.render(this.state.loaded, this.props);
            } else {
                return null;
            }
        }
    };
}

// { (opts): React.ComponentType, Map?(opts): React.ComponentType, Capture?: React.ComponentType, preloadAll?: Function, preloadReady?: Function }
export interface OptionsWithMap<Props, Exports extends { [ key: string ]: any }> extends LoadableExport.CommonOptions {
    /**
     * An object containing functions which return promises, which resolve to an object to be passed to `render` on success.
     */
    loader: {
        [P in keyof Exports]: (props?:any) => Promise<Exports[P]>
    };

    /**
     * If you want to customize what gets rendered from your loader you can also pass `render`.
     *
     * Note: If you want to load multiple resources at once, you can also use `Loadable.Map`.
     *
     * ```ts
     * Loadable({
         *     // ...
         *     render(loaded, props) {
         *         const Component = loaded.default;
         *         return <Component {...props} />
         *     }
         * });
     * ```
     */
    render(loaded: Exports, props: Props): React.ReactNode;
}

export interface ILoadable {
    <Props, Exports extends object>(options: LoadableExport.Options<Props, Exports>): React.ComponentType<Props> & LoadableExport.LoadableComponent;

    Map<Props, Exports extends { [ key: string ]: any }>(options: OptionsWithMap<Props, Exports>): React.ComponentType<Props> & LoadableExport.LoadableComponent;

    /**
     * This will call all of the LoadableComponent.preload methods recursively until they are all
     * resolved. Allowing you to preload all of your dynamic modules in environments like the server.
     * ```ts
     * Loadable.preloadAll().then(() => {
         *   app.listen(3000, () => {
         *     console.log('Running on http://localhost:3000/');
         *   });
         * });
     * ```
     */
    preloadAll(): Promise<void>;

    /**
     * Check for modules that are already loaded in the browser and call the matching
     * `LoadableComponent.preload` methods.
     * ```ts
     * window.main = () => {
         *   Loadable.preloadReady().then(() => {
         *     ReactDOM.hydrate(
         *       <App/>,
         *       document.getElementById('app'),
         *     );
         *   });
         * };
     * ```
     */
    preloadReady(): Promise<void>;

    Capture: React.ComponentType<LoadableExport.LoadableCaptureProps>;

}

let Loadable: ILoadable;

(Loadable as any) = <Props, Exports extends object>(options: LoadableExport.Options<Props, Exports>): React.ComponentType<Props> & LoadableExport.LoadableComponent => {
    return createLoadableComponent(load, options) as any;
}

function LoadableMap(opts) {
    if ( typeof opts.render !== 'function' ) {
        throw new Error('LoadableMap requires a `render(loaded, props)` function');
    }

    return createLoadableComponent(loadMap, opts) as any;
}

Loadable.Map = LoadableMap as any;

class Capture extends React.Component<any> {
    static propTypes = {
        report: PropTypes.func.isRequired
    };

    static childContextTypes = {
        loadable: PropTypes.shape({
            report: PropTypes.func.isRequired
        }).isRequired
    };

    getChildContext() {
        return {
            loadable: {
                report: this.props.report
            }
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

Loadable.Capture = Capture as any;

function flushInitializers(initializers) {
    let promises = [];

    while ( initializers.length ) {
        let init = initializers.pop();
        promises.push(init());
    }

    return Promise.all(promises).then(() => {
        if ( initializers.length ) {
            return flushInitializers(initializers);
        }
    });
}

Loadable.preloadAll = () => {
    return new Promise((resolve, reject) => {
        flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
    });
};

Loadable.preloadReady = () => {
    return new Promise((resolve, reject) => {
        // We always will resolve, errors should be handled within loading UIs.
        flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
    });
};

export { Loadable };

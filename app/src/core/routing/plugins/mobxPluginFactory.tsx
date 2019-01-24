import { NavigationOptions, Plugin, PluginFactory, State } from 'router5';
import { runInAction } from 'mobx';
import { RouterStore } from 'routing/RouterStore';


function extractId(state: State) {
    return state.path;
}

export function mobxPluginFactory(routes, store: RouterStore): PluginFactory {
    function mobxRouterPlugin(): Plugin {
        return {
            onTransitionSuccess(nextState?: State, prevState?: State, opts?: NavigationOptions) {
                const prevParams = (prevState || {} as any).params || {};
                const nextParams = nextState.params || {};
                const prevRoute  = store.routes.get((prevState || {} as any).name) || {} as any;
                const nextRoute  = store.routes.get(nextState.name);

                if ( prevState != null ) {
                    store.callSaveListeners(extractId(prevState));
                }

                if ( prevRoute.onDeactivate != null ) {
                    prevRoute.onDeactivate(prevState, nextState);
                }

                runInAction(() => {
                    store.current = nextState;

                    const h       = store.history;
                    let fromStack = false;
                    if ( prevState != null && opts.replace ) {
                        if ( nextState.meta.id < prevState.meta.id ) {
                            h.pop();
                            fromStack = true;
                        } else {
                            h[ h.length - 1 ] = nextState;
                        }
                    } else {
                        h.push(nextState);
                    }

                    // if ( nextRoute.onActivate != null ) {
                    //     nextRoute.onActivate(nextState, (prevState || {} as any));
                    // }
                });

                if ( prevState != null && nextState.meta.id < prevState.meta.id ) {
                    store.callRestoreListeners(extractId(nextState));
                }
            },
        };
    }

    mobxRouterPlugin[ 'pluginName' ] = 'MOBX_PLUGIN';
    return mobxRouterPlugin as any as PluginFactory;
}

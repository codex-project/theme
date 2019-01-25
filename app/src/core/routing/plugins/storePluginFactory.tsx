import { NavigationOptions, Plugin, PluginFactory, Route, State } from 'router5';


function extractId(state: State) {
    return state.path;
}

export const storePluginFactory = (options: {
    getRoute: (name: string) => Route
    setCurrent: (state: State) => void
    historyPop: () => void
    historyPush: (state: State) => void
    historyReplace: (state: State) => void
    save: (id: string) => void
    restore: (id: string) => void,
    wrapperFn?: (cb: Function) => null
}): PluginFactory => {
    options = {
        getRoute      : () => null,
        setCurrent    : () => null,
        historyPop    : () => null,
        historyPush   : () => null,
        historyReplace: () => null,
        save          : () => null,
        restore       : () => null,
        wrapperFn     : (cb) => cb(),
        ...options,
    };
    return (router, dependencies): Plugin => {
        return {
            onTransitionSuccess(nextState?: State, prevState?: State, opts?: NavigationOptions) {
                const prevParams = (prevState || {} as any).params || {};
                const nextParams = nextState.params || {};
                const prevRoute  = options.getRoute((prevState || {} as any).name) || {} as any;
                const nextRoute  = options.getRoute(nextState.name);

                if ( prevState != null ) {
                    options.save(extractId(prevState));
                }

                options.wrapperFn(() => {
                    options.setCurrent(nextState);
                    if ( prevState != null && opts.replace ) {
                        if ( nextState.meta.id < prevState.meta.id ) {
                            options.historyPop();
                        } else {
                            options.historyReplace(nextState);
                        }
                    } else {
                        options.historyPush(nextState);
                    }
                });

                if ( prevState != null && nextState.meta.id < prevState.meta.id ) {
                    options.restore(extractId(nextState));
                }
            },
        };
    };
};

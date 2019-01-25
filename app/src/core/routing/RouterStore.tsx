import { action, observable, transaction } from 'mobx';
import { Router, State } from 'routing';
import { TransitionPluginTarget } from 'routing/plugins/transitionPluginFactory';
import { injectable, lazyInject } from 'ioc';
import { Application } from 'classes/Application';
import { errorCodes } from 'router5';
import { RouteMap } from './RouteMap.js';

export type SaveListener = (current: State) => { id: string, data: any }
export type RestoreListener = (data: any) => void

const log = require('debug')('routing:store');

function extractId(state: State) {
    return state.path;
}

@injectable()
export class RouterStore implements TransitionPluginTarget {
    @lazyInject('app') app: Application;

    constructor(public readonly routes: RouteMap, public readonly router: Router) {}

    @observable current: State   = null;
    @observable history: State[] = observable.array<State>();

    @observable transitioning: boolean = false;

    @action onTransition(transition: 'start' | 'cancel' | 'error' | 'success', nextState?: State, prevState?: State, opts?) {
        log('onTransition', transition, { nextState, prevState, opts });
        if ( transition === 'start' ) {

        } else if ( transition === 'success' ) {
            if ( prevState != null ) {
                this.callSaveListeners(extractId(prevState));
            }

            transaction(() => {
                this.current = nextState;
                if ( prevState != null && opts.replace ) {
                    if ( nextState.meta.id < prevState.meta.id ) {
                        this.history.pop();
                    } else {
                        this.history[ this.history.length - 1 ] = nextState;
                    }
                } else {
                    this.history.push(nextState);
                }
            });

            if ( prevState != null && nextState.meta.id < prevState.meta.id ) {
                this.callRestoreListeners(extractId(nextState));
            }
        } else if ( transition === 'error' ) {
            let err;
            if ( opts ) {
                err = opts;
            }
            let message = 'An unknown error happend';
            if ( typeof err === 'string' ) {
                message = err;
            } else if ( typeof err.code === 'string' ) {
                message = err.code;
                if ( errorCodes.ROUTE_NOT_FOUND ) {
                    message = 'Could not navigate to the intended URL.';
                }
            } else if ( typeof err.toString === 'function' ) {
                message = err.toString();
            }
            this.app.notification.error({
                message,
            });
            console.warn('TRANSITION ERROR', err);
        } else if ( transition === 'cancel' ) {

        }
    }


    uiStates: { [ id: number ]: { [ id: string ]: any } } = {};
    saveUiCbs                                             = new Array<SaveListener>();
    restoreUiCbs                                          = new Array<RestoreListener>();
    restoreUiCbIds                                        = new Array<string>();

    addSaveListener = (cb: SaveListener): () => void => {
        this.saveUiCbs.push(cb);
        return () => this.removeSaveListener(cb);
    };

    addRestoreListener = (id: string, cb: RestoreListener): () => void => {
        this.restoreUiCbs.push(cb);
        this.restoreUiCbIds.push(id);
        return () => this.removeRestoreListener(cb);
    };

    private removeSaveListener = (cb: SaveListener) => {
        this.saveUiCbs.splice(this.saveUiCbs.indexOf(cb), 1);
    };

    private removeRestoreListener = (cb: RestoreListener) => {
        const i = this.restoreUiCbs.indexOf(cb);
        this.restoreUiCbs.splice(i, 1);
        this.restoreUiCbIds.splice(i, 1);
    };

    callSaveListeners = (id: string) => {
        for ( const cb of this.saveUiCbs ) {
            const res   = cb(this.current);
            const saved = this.uiStates[ id ] || {};
            if ( res != null ) saved[ res.id ] = res.data;
            this.uiStates[ id ] = saved;
        }
    };

    callRestoreListeners = (id: string) => {
        for ( let i = 0; i < this.restoreUiCbs.length; i ++ ) {
            const cbId    = this.restoreUiCbIds[ i ];
            const cb      = this.restoreUiCbs[ i ];
            const uiState = this.uiStates[ id ];
            cb(uiState == null ? null : uiState[ cbId ]);
        }
    };


}

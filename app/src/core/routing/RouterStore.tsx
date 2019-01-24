import { Router } from 'router5';
import { action, observable } from 'mobx';
import { IRouteMap, State } from 'routing/types';
import { TransitionPluginTarget } from 'routing/plugins/transitionPlugin';

export type SaveListener = (current: State) => { id: string, data: any }
export type RestoreListener = (data: any) => void

const log = require('debug')('routing:store');

export class RouterStore implements TransitionPluginTarget {

    constructor(public readonly routes: IRouteMap, public readonly router: Router) {}

    @observable current: State   = null;
    @observable history: State[] = observable.array<State>();

    @observable transitioning: boolean = false;

    @action onTransition(transition: 'start' | 'cancel' | 'error' | 'success', toState?: State, fromState?: State, err?: any) {
        log('onTransition', transition, { toState, fromState, err });
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

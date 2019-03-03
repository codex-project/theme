import { SyncBailHook, SyncHook } from 'tapable';
import { Router } from './Router';
import { Route } from './interfaces';
import { action, computed, observable } from 'mobx';

const log = require('debug')('router:Transition');
const slog = require('debug')('router:Transition:state');

export  type TransitionStatus = 'started' | 'finished' | 'canceled';
export  type TransitionStep = 'canLeave' | 'beforeLeave' | 'canEnter' | 'leave' | 'beforeEnter' | 'enter';

export class Transition {
    public readonly hooks = {
        started : new SyncBailHook(),
        leave   : new SyncBailHook(),
        enter   : new SyncHook(),
        finished: new SyncHook(),
        canceled: new SyncHook(),
    };

    @observable status: TransitionStatus = null;
    @observable step: TransitionStep     = null;

    @action
    protected setStatus(status: TransitionStatus) {
        log(status, this)
        this.status = status;
    }

    @action
    protected setStep(step: TransitionStep) {
        slog(step)
        this.step = step;
    }

    constructor(protected router: Router, protected options: { replace?: boolean, push?: boolean, pop?:boolean } = {}) {
        log('constructed', this, options)
    }

    @computed get finished() {return this.status === 'finished' || this.status === 'canceled';}

    @computed get canceled() {return this.status === 'canceled';}

    promise: Promise<any>;

    cancel() {
        if ( ! this.canceled && ! this.finished ) {
            if ( this.promise && ! this.promise.isCancelled && ! this.promise.isFulfilled ) {
                this.promise.cancel();
            }
            this.setStatus('canceled');
            this.router.emit('transition.canceled', this);
            this.hooks.canceled.call();
        }
        return this.canceled;
    }

    from: State;
    to: State;

    start() {
        this.setStatus('started');
        this.router.emit('transition.started', this);
        if ( this.hooks.started.call() !== undefined ) {
            return this.cancel();
        }

        if ( this.canceled ) {
            return;
        }
        this.promise = new Promise(async (res, rej) => {
            this.setStep('canLeave');
            if ( this.from.route.canLeave ) {
                let canLeave = await this.from.route.canLeave(this.from);
                if ( canLeave !== true && canLeave !== undefined && canLeave !== null ) {
                    return this.cancel();
                }
            }
            this.setStep('beforeLeave');
            if ( this.from.route.beforeLeave ) {
                await this.from.route.beforeLeave(this.from);
            }
            this.setStep('canEnter');
            if ( this.to.route.canEnter ) {
                let canEnter = await this.to.route.canEnter(this.to);
                if ( canEnter !== true && canEnter !== undefined && canEnter !== null ) {
                    return this.cancel();
                }
            }

            this.setStep('leave');
            if ( this.hooks.leave.call() !== undefined ) {
                return this.cancel();
            }
            this.router.emit('state.leave', this);

            if(!this.options.pop) { // pop = history.go
                if ( this.options.replace ) {
                    this.router.history.replace(this.to.url);
                } else {
                    this.router.history.push(this.to.url);
                }
            }

            this.setStep('beforeEnter');
            if ( this.to.route.beforeEnter ) {
                await this.to.route.beforeEnter(this.to);
            }

            this.setStep('enter');
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
            this.setStatus('finished');
            this.router.current = this.to;
            this.hooks.finished.call();
            this.router.emit('transition.finished', this);
        });

    }
}


export class State {
    name: string;
    route: Route;
    params: object;
    url: string;
    meta: any = {};
}

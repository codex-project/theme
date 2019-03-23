import { SyncBailHook, SyncHook } from 'tapable';
import { Router } from './Router';
import { action, computed, observable } from 'mobx';
import { State } from './State';

const log  = require('debug')('router:Transition');
const slog = require('debug')('router:Transition:state');

export  type TransitionStatus = 'started' | 'finished' | 'canceled' | 'forwarded';
export  type TransitionStep = 'canLeave' | 'beforeLeave' | 'canEnter' | 'leave' | 'beforeEnter' | 'enter' | 'entered';

export class Transition {
    static count          = 0;
    public readonly hooks = {
        started : new SyncBailHook(),
        leave   : new SyncBailHook(),
        enter   : new SyncHook(),
        entered : new SyncHook(),
        finished: new SyncHook(),
        canceled: new SyncHook(),
    };
    id: number;

    @observable status: TransitionStatus = null;
    @observable step: TransitionStep     = null;

    @action
    protected setStatus(status: TransitionStatus) {
        log(this.id + ':' + status,
            this.from ? this.from.name : null,
            this.from ? this.from.url : null,
            ' -> ',
            this.to.name,
            this.to.url,
        );
        this.status = status;
        this.router.emit(`transition.${status}`);
    }

    @action
    protected setStep(step: TransitionStep) {
        slog(step);
        this.step = step;
        this.router.emit(`state.${step}`, this);
    }


    constructor(protected router: Router, protected options: { replace?: boolean, push?: boolean, pop?: boolean } = {}) {
        this.id = Transition.count;
        Transition.count ++;
        log(this.id + ':constructed', this, options);
    }

    @computed get finished() {return this.status === 'finished' || this.status === 'canceled';}

    @computed get canceled() {return this.status === 'canceled';}

    @computed get forwarded() {return this.status === 'forwarded';}

    promise: Promise<any>;

    cancel() {
        if ( ! this.canceled && ! this.finished ) {
            if ( this.promise && ! this.promise.isCancelled && ! this.promise.isFulfilled ) {
                this.promise.cancel();
            }
            this.setStatus('canceled');
            this.hooks.canceled.call();
            this.hooks.finished.call();
        }
        return this.canceled;
    }

    from: State;
    to: State;

    start() {
        this.setStatus('started');
        if ( this.hooks.started.call() !== undefined ) {
            return this.cancel();
        }

        if ( this.canceled ) {
            return;
        }
        this.promise = new Promise(async (res, rej) => {
            if ( this.from ) {
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
            }

            this.setStep('leave');
            if ( this.hooks.leave.call() !== undefined ) {
                return this.cancel();
            }

            this.setStep('canEnter');
            if ( this.to.route.canEnter ) {
                let canEnter = await this.to.route.canEnter(this.to);
                if ( canEnter !== true && canEnter !== undefined && canEnter !== null ) {
                    this.cancel();
                }
                if ( typeof canEnter === 'function' ) {
                    this.to.render = canEnter;
                } else if ( this.router.isTo(canEnter) ) {
                    this.router.navigateTo(canEnter);
                }
            }

            if ( ! this.options.pop ) { // pop = history.go
                if ( this.options.replace ) {
                    this.router.history.replace(this.to.url);
                } else {
                    this.router.history.push(this.to.url);
                }
            }


            this.setStep('beforeEnter');
            if ( this.to.route.beforeEnter ) {
                let beforeEnter = await this.to.route.beforeEnter(this.to);
            }

            this.setStep('enter');
            this.hooks.enter.call();
            if ( this.to.route.enter ) {
                let enter = await this.to.route.enter(this.to);
                if ( typeof enter === 'function' ) {
                    this.to.render = enter;
                }
            }

            this.setStep('entered');
            res();
        });
        if ( this.canceled ) {
            return;
        }
        this.promise.then(async () => {

            if ( this.to.route.redirect ) {
                let to = await this.to.route.redirect(this.to, this.router);
                this.setStatus('forwarded');
                this.router.navigateTo(to);
                return;
            }


            this.setStatus('finished');
            this.hooks.finished.call();
        });

    }
}

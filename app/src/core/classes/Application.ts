import { Container, interfaces } from 'inversify';
import { Dispatcher, EventTypes } from './Dispatcher';
import EventEmitter from 'eventemitter3';
import { Api } from '@codex/api';
import { render } from '../utils/render';
import { IConfig } from '../interfaces';
import { merge } from 'lodash';
import { config } from '../config';
import { ComponentType } from 'react';
import { SyncHook } from 'tapable';
import { Store } from '../stores';
import { Routes } from '../collections/Routes';

import { History } from 'history';
import * as url from '../utils/url';
import { MenuManager } from '../menus';

const log = require('debug')('classes:Application');

export class Application extends Container {
    protected plugins: Array<(app: this) => void> = [];
    protected registered                          = false;
    protected booted                              = false;
    protected Component: ComponentType            = null;

    public readonly hooks: {
        register: SyncHook<Application>
        registered: SyncHook<Application>
        boot: SyncHook<Application>
        booted: SyncHook<Application>
    } = {
        register  : new SyncHook<this>([ 'application' ]),
        registered: new SyncHook<this>([ 'application' ]),
        boot      : new SyncHook<this>([ 'application' ]),
        booted    : new SyncHook<this>([ 'application' ]),
    };

    get menus(): MenuManager { return this.get('menumanager');}

    get events(): Dispatcher { return this.get('events'); }

    get api(): Api { return this.get('api'); }

    get store(): Store { return this.get('store'); }

    get routes(): Routes { return this.get('routes'); }

    get history(): History { return this.get('history'); }

    get config(): IConfig { return this.get('config');}

    get debug(): boolean { return this.config.debug === true; }

    get url(): typeof url {return url;}

    constructor(containerOptions: interfaces.ContainerOptions) {
        super(containerOptions);
        this.bind('app').toConstantValue(this);
        this.bind('events').to(Dispatcher).inSingletonScope();
        this.bind('config').toConstantValue(config);
    }

    use(plugin: (app: this) => void): this {
        // plugin(this);
        this.plugins.push(plugin);
        return this;
    }

    configure(config: Partial<IConfig>): this {
        config = merge(this.get('config'), config);
        this.rebind('config').toConstantValue(config);
        return this;
    }

    register(config: Partial<IConfig>): this {
        if ( this.registered ) return this;
        this.emit('register', this);
        this.hooks.register.call(this);
        this.configure(config);

        this.plugins.forEach(plugin => plugin(this));

        this.registered = true;
        this.emit('registered', this);
        this.hooks.registered.call(this);
        log('registered', this);
        return this;
    }

    boot(Component: ComponentType): this {
        if ( this.booted ) return this;
        this.Component = Component;
        this.emit('boot', this);
        this.hooks.boot.call(this);

        this.render(Component, () => {
            this.booted = true;
            log('booted', this);
            this.emit('booted', this);
            this.hooks.booted.call(this);

        });
        return this;
    }

    render(Component?: ComponentType, cb?: () => void): this {
        render(this.config.rootID, Component || this.Component, cb);
        return this;
    }

    bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>, alias?: string): interfaces.BindingToSyntax<T> {
        let binding = super.bind<T>(serviceIdentifier);
        if ( alias ) {
            this.bind(alias).toDynamicValue(ctx => ctx.container.get(serviceIdentifier));
        }
        return binding;
    }

    eventNames(): Array<EventTypes> {return this.events.eventNames.apply(this.events, arguments);}

    listeners(event: EventTypes): Array<EventEmitter.ListenerFn> {return this.events.listeners.apply(this.events, arguments);}

    listenerCount(event: EventTypes): number {return this.events.listenerCount.apply(this.events, arguments);}

    emit(event: EventTypes, ...args: Array<any>): boolean {return this.events.emit.apply(this.events, arguments);}

    on(event: EventTypes, fn: EventEmitter.ListenerFn, context?: any): Dispatcher {return this.events.on.apply(this.events, arguments);}

    addListener(event: EventTypes, fn: EventEmitter.ListenerFn, context?: any): Dispatcher {return this.events.addListener.apply(this.events, arguments);}

    once(event: EventTypes, fn: EventEmitter.ListenerFn, context?: any): Dispatcher {return this.events.once.apply(this.events, arguments);}

    removeListener(event: EventTypes, fn?: EventEmitter.ListenerFn, context?: any, once?: boolean): Dispatcher {return this.events.removeListener.apply(this.events, arguments);}

    off(event: EventTypes, fn?: EventEmitter.ListenerFn, context?: any, once?: boolean): Dispatcher {return this.events.off.apply(this.events, arguments);}

    removeAllListeners(event?: EventTypes): Dispatcher {return this.events.removeAllListeners.apply(this.events, arguments);}
}

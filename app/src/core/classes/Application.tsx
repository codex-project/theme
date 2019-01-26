import { Container, interfaces } from 'inversify';
import { Dispatcher, EventTypes } from './Dispatcher';
import EventEmitter from 'eventemitter3';
import { Api } from '@codex/api';
import { IConfig } from '../interfaces';
import { merge } from 'lodash';
import { config } from '../config';
import React, { ComponentType } from 'react';
import { SyncHook } from 'tapable';
import { History } from 'history';
import { CssVariables } from './CssVariables';
import { Breakpoints } from '../utils/breakpoints';
import { CookieStorage, LocalStorage, SessionStorage } from '../utils/storage';
import { app } from '../ioc';
import ReactDOM from 'react-dom';
import { IUrl, url } from './Url';
import { Plugin } from './Plugin';
import { notification } from 'antd';
import { NotificationApi } from 'antd/lib/notification';
import { MenuManager } from 'menus';
import { RouteMap } from 'router';
import { Store } from 'stores';

const log = require('debug')('classes:Application');

type PluginMap = Map<string, Plugin> & {
    get<P extends Plugin = Plugin>(key: string): P | undefined;
}
type PluginMapProxy = PluginMap & Record<string, Plugin>

function createPluginMapProxy<T extends Map<string, Plugin> = Map<string, Plugin>>(target: T): PluginMapProxy {
    return new Proxy(target as any, {
        get(target: T, p: PropertyKey, receiver: any): any {
            let result;
            let name = p.toString();
            if ( p in target ) {
                result = target[ p ];
            }
            if ( target.has(name) ) {
                result = target.get(name);
            }
            if ( typeof result === 'function' ) {
                result = result.bind(target);
            }
            log('pluginMap', 'get', name, { target, p, result, receiver });
            return result;
        },
    });
}

export class Application extends Container {
    public readonly plugins: PluginMapProxy       = createPluginMapProxy(new Map());
    public readonly notification: NotificationApi = notification;

    protected registered            = false;
    protected booted                = false;
    public Component: ComponentType = null;

    public readonly hooks: {
        register: SyncHook<Application>
        registered: SyncHook<Application>
        boot: SyncHook<Application>
        booted: SyncHook<Application>
    } = {
        register  : new SyncHook<Application>([ 'application' ]),
        registered: new SyncHook<Application>([ 'application' ]),
        boot      : new SyncHook<Application>([ 'application' ]),
        booted    : new SyncHook<Application>([ 'application' ]),
    };

    constructor(containerOptions: interfaces.ContainerOptions) {
        super(containerOptions);
        this.bind('app').toConstantValue(this);
        this.bind('events').to(Dispatcher).inSingletonScope();
        this.bind('config').toConstantValue(config);
        this.bind('url').toConstantValue(url);
    }

    plugin(plugin: Plugin) {
        log('plugin', plugin.name, plugin);
        this.plugins.set(plugin.name, plugin);
        if ( this.registered ) {
            this.installPlugin(plugin);
        }
        return this;
    }

    protected async loadPlugin(plugin: Plugin): Promise<any> {
        if ( plugin.loading === null ) {
            plugin.loading = this.loadAsync(plugin.module);
            log('loadPlugin', plugin.name, plugin);
        }
        return plugin.loading;
    }

    protected async installPlugin(plugin: Plugin): Promise<any> {
        if ( plugin.installed === true ) {
            return this;
        }
        log('installPlugin', plugin.name, plugin);
        plugin.installed = true;
        plugin.install(this);
        log('installedPlugin', plugin.name, plugin);
    }

    use(cb: (app: this) => void): this {
        cb(this);
        return this;
    }

    configure(config: Partial<IConfig>): this {
        config = merge(this.get('config'), config);
        this.rebind('config').toConstantValue(config);
        return this;
    }

    async register(config: Partial<IConfig>): Promise<this> {
        if ( this.registered ) return this;

        this.configure(config);

        log('register loadPlugins', Array.from(this.plugins.keys()));
        await Promise.all(Array.from(this.plugins.values()).map(async plugin => this.loadPlugin(plugin)));
        log('register installPlugins', Array.from(this.plugins.keys()));
        await Promise.all(Array.from(this.plugins.values()).map(async plugin => this.installPlugin(plugin)));
        log('register installedPlugins', Array.from(this.plugins.keys()));

        this.emit('register', this);
        this.hooks.register.call(this);

        this.registered = true;
        this.emit('registered', this);
        this.hooks.registered.call(this);
        log('registered', this);
        return this;
    }

    async boot(Component: ComponentType = this.Component): Promise<this> {
        if ( this.booted ) return this;
        this.Component = Component;
        this.emit('boot', this);
        this.hooks.boot.call(this);

        return new Promise<this>((resolve, reject) => {
            this.render(Component, () => {
                this.booted = true;
                log('booted', this);
                this.emit('booted', this);
                this.hooks.booted.call(this);
                resolve(this);
            });
        });
    }

    renderWrappers = new Set([]);

    render(Component?: ComponentType, cb?: () => void): this {
        Component           = Component || this.Component;
        const el = document.getElementById(this.config.rootID);
        ReactDOM.render(React.createElement(Component), el, cb);
        return this;
    }

    bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>, alias?: string): interfaces.BindingToSyntax<T> {
        let binding = super.bind<T>(serviceIdentifier);
        if ( alias ) {
            this.bind(alias).toDynamicValue(ctx => ctx.container.get(serviceIdentifier));
        }
        return binding;
    }


    get localStorage(): typeof LocalStorage {return this.get('storage.local');}

    get sessionStorage(): typeof SessionStorage {return this.get('storage.session');}

    get cookieStorage(): typeof CookieStorage {return this.get('storage.cookies');}

    get cssvars(): CssVariables { return this.get('cssvars');}

    get breakpoints(): Breakpoints { return this.get('breakpoints');}

    get menus(): MenuManager { return this.get('menumanager');}

    get events(): Dispatcher { return this.get('events'); }

    get api(): Api { return this.get('api'); }

    get routes(): RouteMap { return this.get('routes'); }

    get store(): Store { return this.get('store'); }

    get history(): History { return this.get('history'); }

    get config(): IConfig { return this.get('config');}

    get debug(): boolean { return this.config.debug === true; }

    get url(): IUrl {return this.get('url');}


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

import { Application } from './Application';
import { Hook } from 'tapable';
import { injectable } from '../ioc';
import { AsyncContainerModule, interfaces } from 'inversify';

export type Bind = interfaces.Bind
export type Unbind = interfaces.Unbind
export type IsBound = interfaces.IsBound
export type Rebind = interfaces.Rebind

export interface PluginConstructor {
    new(...args): Plugin
}


export interface Plugin<T = Record<string, Hook>> {
    name: string
    installed: boolean
    hooks: T
    loading?: Promise<any>
    module: AsyncContainerModule

    install(app: Application)


    register?(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any>
}

@injectable()
export abstract class BasePlugin<T = {}> implements Plugin {
    constructor(options: T) {
        this.options = options;
    }

    name:string

    protected options: T;
    installed: boolean = false;
    hooks              = {};
    loading            = null;

    get module(): AsyncContainerModule {
        return new AsyncContainerModule(async (bind, unbind, isBound, rebind) => {
            if ( typeof this[ 'register' ] === 'function' ) {
                await this[ 'register' ](bind, unbind, isBound, rebind);
            }
        });
    }

    abstract install(app: Application)
}


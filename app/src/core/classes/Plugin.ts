import { Application } from 'classes/Application';
import { Hook } from 'tapable';
import { injectable } from 'ioc';

export interface PluginConstructor {
    new(...args): Plugin
}

export interface Plugin<T = Record<string, Hook>> {
    name: string
    installed: boolean
    hooks: T

    install(app: Application)
}

@injectable()
export abstract class BasePlugin<T = {}> implements Plugin {
    get name() { return this.constructor.name.replace(/Plugin$/m, ''); }

    set name(name: string) { }

    protected options: T;
    installed: boolean = false;
    hooks              = {};

    abstract install(app: Application)

    constructor(options: T) {
        this.options = options;
    }
}

import { Config } from './Config';
import { lazyInject } from '../ioc';
import { warn } from 'utils/general';
import { Application } from './Application';
import { LayoutStore, Store } from 'stores';

export class ObjectStringCompiler extends Config {
    @lazyInject('app') _app: Application;
    @lazyInject('store') _store: Store;
    @lazyInject('store.layout') _layout: LayoutStore;
    compileKeyPrefix = '_value';


    constructor(obj: Object = {}) {
        super(obj);
        this.set('app', this._app);
        this.set('store', this._store);
        this.set('layout', this._layout);
    }

    compile<T extends Record<string, any>>(obj?: T, recursive: boolean = true): T {
        if ( obj === undefined || obj === null ) {
            return obj;
        }
        Object.keys(obj)
            .filter(key => typeof obj[ key ] === 'string' || (recursive && typeof obj[ key ] === 'object'))
            .forEach(key => {
                if ( recursive && typeof obj[ key ] === 'object' ) {
                    obj[ key ] = this.compile(obj[ key ], recursive);
                    return;
                }
                try {
                    this.set(`${this.compileKeyPrefix}.${key}`, obj[ key ]);
                    let value = this.get(`${this.compileKeyPrefix}.${key}`, obj[ key ]);
                    if ( obj[ key ] !== value ) {
                        obj[ key ] = value;
                    }
                } catch ( error ) {
                    warn(`DynamicContent compile error on [${key}] of component`, { error, childProps: obj, component: this });
                }
            });
        return obj as T;
    }
}

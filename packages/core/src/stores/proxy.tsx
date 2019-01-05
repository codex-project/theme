import { action, computed, observable, runInAction, toJS } from 'mobx';
import { cloneDeep, has, set } from 'lodash';

declare const __decorate, __metadata;

export function createStoreProxy<DATA>(data: DATA): IStoreProxy<DATA> {
    class StoreProxy<DATA> {
        protected _data: DATA;
        public meta: any;

        constructor(data: DATA) {
            this._data = observable(data as any);
            this.meta = observable({});
            let proto  = Object.getPrototypeOf(this);
            Object.keys(data).forEach(key => {
                Object.defineProperty(proto, key, {
                    get         : () => {
                        return this._data[ key ];
                    },
                    set         : (val: any) => {
                        runInAction(() => this._data[ key ] = val);
                    },
                    enumerable  : true,
                    configurable: true,
                });
                __decorate([ computed, __metadata('design:type', Object), __metadata('design:paramtypes', []) ], proto, key, null);
            });
        }

        @action set<PROP extends keyof DATA>(prop: string, value: any) {
            set(this._data as any, prop, value);// prop         = prop.split('.').slice(1).join('.')
            return this;
        }

        has<PROP extends keyof DATA>(prop: string) { return has(this._data as any, prop);}

        toJS() { return toJS(this._data); }
    }

    return new StoreProxy<any>(data) as any;
}

export interface IStoreProxyMethods<DATA> {
    meta:any
    set<PROP extends keyof DATA>(prop: PROP, value: DATA[PROP]): this

    has<PROP extends keyof DATA>(prop: PROP): boolean

    toJS(): DATA
}

export type IStoreProxy<DATA> = IStoreProxyMethods<DATA> & Partial<DATA>

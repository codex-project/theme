import { action, computed, observable, runInAction, toJS } from 'mobx';
import { cloneDeep, has, set } from 'lodash';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

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
import React from 'react';
import { generatePath, Redirect } from 'react-router';
import { SyncWaterfallHook } from 'tapable';
import { RouteDefinition } from './types';

const log = require('debug')('router:RouteMap');

export class RouteMap<T extends RouteDefinition = RouteDefinition> implements Map<string, T> {
    protected map = new Map();
    hooks         = {
        set: new SyncWaterfallHook<T>([ 'value', 'key' ]),
    };

    set(key, value, override = false) {
        if ( false === override && this.map.has(key) ) {
            console.warn(`Could not set route "${key}". Route already exists. Enable override if this action is intended`);
            return this;
        }
        value = this.hooks.set.call(value, key);
        this.map.set(key, value);
        return this;
    }


    [ Symbol.iterator ]: () => IterableIterator<[ string, T ]>;
    [ Symbol.toStringTag ]: 'Map';
    clear   = () => this.map.clear();
    delete  = (key: string) => this.map.delete(key);
    entries = () => this.map.entries();
    forEach = (callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any) => this.map.forEach(callbackfn, thisArg);
    get     = (key: string) => this.map.get(key);
    has     = (key: string) => this.map.has(key);
    keys    = () => this.map.keys();
    size    = this.map.size;
    toJSON  = () => this.map.toJSON();
    values  = () => this.map.values();
}

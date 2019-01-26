import React from 'react';
import { generatePath, match, matchPath } from 'react-router';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import { RouteDefinition, RouteDefinitionTestKeys } from './types';
import { Action, History, Location } from 'history';

const log = require('debug')('router:RouteMap');


export class RouteMap<T extends RouteDefinition = RouteDefinition, E extends RouteDefinitionTestKeys = RouteDefinitionTestKeys, TE extends T & E = T & E> implements Map<string, T> {
    protected map         = new Map();
    public history: History;
    public readonly hooks = {
        set       : new SyncWaterfallHook<T>([ 'value', 'key' ]),
        transition: new SyncHook<Location, Action>([ 'location', 'action' ]),
    };

    set(key, value: T, override = false) {
        if ( false === override && this.map.has(key) ) {
            console.warn(`Could not set route "${key}". Route already exists. Enable override if this action is intended`);
            return this;
        }
        value = this.hooks.set.call(value, key);
        this.map.set(key, value);
        return this;
    }

    push            = (...routes: T[]) => routes.forEach(route => this.set(route.name, route));
    items           = (): TE[] => Array.from(this.map.values()) as any;
    find            = (predicate: (value: TE, index: number, obj: TE[]) => boolean, thisArg?: any) => this.items().find(predicate, thisArg);
    getCurrentRoute = (): TE | undefined => this.find(route => route.test.test(this.history.location.pathname));
    generatePath    = (routeName: string, routeParams?: any) => this.has(routeName) ? decodeURIComponent(generatePath(this.get(routeName).path, routeParams)) : undefined;

    toUrl(to) {
        if ( typeof to === 'string' ) {
            return to;
        } else if ( to.path ) {
            return to.path;
        } else if ( to.pathname ) {
            return to.pathname;
        } else if ( to.name ) {
            return this.generatePath(to.name, to.params);
        }
    }

    matchPath(pathname: string): match<any>[] {
        let matches = Array.from(this.values()).map(route => matchPath(pathname, {
            exact    : route.exact,
            path     : route.path,
            sensitive: route.sensitive,
            strict   : route.strict,
        })).filter(Boolean);
        return matches;
    }

    getRouteParams(route: TE, pathname: string): Record<string, string> {
        let params: Record<string, string> = {};
        let values                         = route.test.exec(pathname);
        values.shift(); // first item is the full path, remove it from array
        values.map((value, index) => {
            let name       = route.keys[ index ].name;
            params[ name ] = value;
        });
        return params;
    }

    [ Symbol.iterator ]: () => IterableIterator<[ string, TE ]>;
    [ Symbol.toStringTag ]: 'Map';
    clear   = () => this.map.clear();
    delete  = (key: string) => this.map.delete(key);
    entries = (): IterableIterator<[ string, TE ]> => this.map.entries();
    forEach = (callbackfn: (value: TE, key: string, map: Map<string, TE>) => void, thisArg?: any) => this.map.forEach(callbackfn, thisArg);
    get     = (key: string): TE => this.map.get(key);
    has     = (key: string) => this.map.has(key);
    keys    = () => this.map.keys();
    size    = this.map.size;
    toJSON  = () => this.map.toJSON();
    values  = (): IterableIterator<TE> => this.map.values();
}

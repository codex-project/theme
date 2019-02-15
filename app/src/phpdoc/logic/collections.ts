import { api } from '@codex/api';
import { PhpdocMethod } from './types';
// noinspection ES6UnusedImports
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';

export class Collection<T> extends Array<T> implements Array<T> {

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, Collection.prototype);
    }

    static make<T>(items: T[]) { return new Collection<T>(...items); }

    first() { return this[ 0 ]; }

    last() { return this[ this.length - 1 ]; }

    findBy(key: keyof T, value: any): T | undefined { return this.find(item => item[ key ] === value); }

    where(key: keyof T, value: any): this { return this.newInstance(...this.filter(item => item[ key ] === value)); }

    whereIn(key: keyof T, values: any[]): this {return this.newInstance(...this.filter(item => values.includes(item[ key ]) === true)); }

    whereNotIn(key: keyof T, values: any[]): this {return this.newInstance(...this.filter(item => values.includes(item[ key ]) === false)); }

    newInstance(...items: T[]): this {
        let Class    = this.constructor as any;
        let instance = new Class(...items);
        return instance as this;
    }

    keyBy<K extends keyof T>(key: K | ((item: T) => string)): Record<string, T> {
        let cb: ((item: T) => string) = key as any;
        if ( typeof key === 'string' ) {
            cb = item => item[ key as any ];
        }
        let result = {};
        this.forEach(item => {
            let key       = cb(item);
            result[ key ] = item;
        });
        return result as any;
    }

    mapKeyBy<K extends keyof T>(key: K | ((item: T) => string)): Map<K, T> {
        let cb: ((item: T) => string) = key as any;
        if ( typeof key === 'string' ) {
            cb = item => item[ key as any ];
        }
        let result = new Map();
        this.forEach(item => {
            let key = cb(item);
            result.set(key, item);
        });
        return result as any;
    }

    getValues(): T[] {
        return Array.from(this.values());
    }

    toList(): ImmutableList<T> {
        return ImmutableList(this.getValues());
    }
}

export class NamedCollection<T> extends Collection<T> {
    KEYNAME: string = 'name';

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, NamedCollection.prototype);
    }

    get(keyValue) {
        return this.findBy(this.KEYNAME as any, keyValue);
    }

    has(key) {
        return this.get(key) !== undefined;
    }

    getKeys(): string[] {
        return this.map(item => item[ this.KEYNAME ]);
    }

    getIndex(keyValue) {
        return this.findIndex(item => item[ this.KEYNAME ] === keyValue);
    }

    only(keys: string[]) {
        return this.whereIn(this.KEYNAME as any, keys);
    }

    without(keys: string[]) {
        return this.whereNotIn(this.KEYNAME as any, keys);
    }

    toMap(keyName = this.KEYNAME): ImmutableMap<string, T> {
        let map = this.mapKeyBy(keyName as any);
        return ImmutableMap(map);
    }
}

export class Methods<T extends api.PhpdocMethod = PhpdocMethod> extends NamedCollection<T> {
    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, Methods.prototype);
    }
}

export class Properties<T extends api.PhpdocProperty = api.PhpdocProperty> extends NamedCollection<T> {
    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, Properties.prototype);
    }
}

export class Arguments<T extends api.PhpdocArgument = api.PhpdocArgument> extends NamedCollection<T> {
    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, Arguments.prototype);
    }
}

export class Tags<T extends api.PhpdocTag = api.PhpdocTag> extends NamedCollection<T> {
    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, Tags.prototype);
    }
}

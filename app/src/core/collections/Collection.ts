export function collect<T>(items: T[]) {
    return new Collection<T>(...items);
}

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

    toNamed(keyname): NamedCollection<T> {
        let named     = new NamedCollection<T>();
        named.KEYNAME = keyname;
        return named;
    }
}

export class NamedCollection<T> extends Collection<T> {
    KEYNAME: string = 'name';

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, NamedCollection.prototype);
    }

    get(key) {
        return this.findBy(this.KEYNAME as any, key);
    }

    has(key) {
        return this.get(key) !== undefined;
    }

    getKeys(): string[] {
        return this.map(item => item[ this.KEYNAME ]);
    }

    only(keys: string[]) {
        return this.whereIn(this.KEYNAME as any, keys);
    }

    without(keys: string[]) {
        return this.whereNotIn(this.KEYNAME as any, keys);
    }
}

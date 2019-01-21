export class Collection<T> extends Array<T> implements Array<T> {

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, Collection.prototype);
    }

    static make<T>(items: T[]) { return new Collection<T>(...items); }

    first() { return this[ 0 ]; }

    last() { return this[ this.length - 1 ]; }

    findBy(key: keyof T, value: any): T | undefined { return this.find(item => item[ key ] === value); }

    where(key: keyof T, value: any): Collection<T> { return new Collection<T>(...this.filter(item => item[ key ] === value)); }

    newInstance(...items: T[]): this {
        let Class: typeof Collection = this.constructor as any;
        let instance                 = new Class<T>(...items);
        return instance as this;
    }

    keyBy<K extends keyof T>(key: K | ((item: T) => string)): Map<K, T> {
        let cb: ((item: T) => string) = key as any;
        if ( typeof key === 'string' ) {
            cb = item => item[ key as any ];
        }
        let result = new Map();
        this.forEach(item => {
            let key = cb(item);
            result.set(key, item);
        });
        return result;
    }
}

export function collect<T>(items: T[]) {
    return new Collection<T>(...items);
}

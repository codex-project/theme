export declare class Collection<T> extends Array<T> implements Array<T> {
    constructor(...items: T[]);
    static make<T>(items: T[]): Collection<T>;
    first(): T;
    last(): T;
    findBy(key: keyof T, value: any): T | undefined;
    where(key: keyof T, value: any): Collection<T>;
    keyBy<K extends keyof T>(key: K | ((item: T) => string)): Map<K, T>;
}
export declare function collect<T>(items: T[]): Collection<T>;

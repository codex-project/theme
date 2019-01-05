import { DictionaryWrapper } from 'collections/DictionaryWrapper';
export declare class ObservableDictionaryWrapper<T> {
    constructor(data?: T);
    protected _data: T;
    readonly data: T;
    toJS(): T;
    has: (path: string) => boolean;
    get: <T_1>(path: string, defaultValue?: T_1) => T_1;
    set: (path: string, value: any) => any;
    unset: (path: string) => boolean;
    merge: (value: any) => any;
    clone: () => DictionaryWrapper<T>;
    cloneRaw: () => T;
    keys: () => string[];
}

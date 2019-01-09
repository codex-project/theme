// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash'

export class DictionaryWrapper<T> {
    constructor(public data: T) {}

    has      = (path: string) => has(this.data, path)
    get      = <T>(path: string, defaultValue?: T): T => get(this.data, path, defaultValue)
    set      = (path: string, value: any) => set(this.data as any, path, value)
    unset    = (path: string) => unset(this.data, path)
    merge    = (value: any) => merge(this.data, value);
    clone    = (): DictionaryWrapper<T> => new DictionaryWrapper(this.cloneRaw());
    cloneRaw = (): T => cloneDeep(this.data)
    keys     = (): string[] => Object.keys(this.data);

}

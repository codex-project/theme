// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash'
import { action, computed, observable, toJS } from 'mobx';
import { DictionaryWrapper } from './DictionaryWrapper';


export class ObservableDictionaryWrapper<T> {
    constructor(data?: T) {
        if ( data ) this.merge(data)
    }

    @observable protected _data: T = {} as any
    @computed get data(): T {return this._data}

    toJS(): T {return toJS(this._data)}

    has           = (path: string) => has(this._data, path)
    get           = <T>(path: string, defaultValue?: T): T => get(this._data, path, defaultValue)
    @action set   = (path: string, value: any) => set(this._data as any, path, value)
    @action unset = (path: string) => unset(this._data, path)
    @action merge = (value: any) => merge(this._data, value);
    clone         = (): DictionaryWrapper<T> => new DictionaryWrapper(this.cloneRaw());
    cloneRaw      = (): T => cloneDeep(this.toJS())
    keys          = (): string[] => Object.keys(this.data);

}

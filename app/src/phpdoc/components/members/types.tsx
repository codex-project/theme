import { PhpdocMethod, PhpdocProperty } from '../../logic';
import { List, Map } from 'immutable';


export type IListItem = PhpdocProperty | PhpdocMethod
export type IListMap = Map<string, IListItem>
export type IListItems = List<IListItem>

export interface IListFilters {
    public: boolean,
    protected: boolean,
    private: boolean,
    static: boolean,
    abstract: boolean,
    final: boolean,
    inherited: boolean,
    name: string,
}

export interface IList {
    items: IListItems
    filtered: number[]
    search: string
    selected: IListItem
    isSelected: (item: string | IListItem) => boolean
    setSelected: (item: string | IListItem) => any
    setSearch: (search: string) => any
    setFilter: <N extends keyof IListFilters>(name: N, value: IListFilters[N]) => any
    resetFilters: () => any
    filters: IListFilters
    filter: () => any
}

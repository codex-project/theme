import { FQSEN, Methods, PhpdocFile, PhpdocManifest, PhpdocMethod, PhpdocProperty, Properties } from '../../logic';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { FQSENComponent, FQSENComponentContext, FQSENComponentProps } from '../base';
import { api } from '@codex/api';
import { List } from 'immutable';


export type IListItem = PhpdocProperty | PhpdocMethod
export type IListMap = Map<string, IListItem>
export type IListList = List<IListItem>

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
    items: IListList
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

export interface ListContextValue {
    manifest: PhpdocManifest
    file: PhpdocFile
    fqsen: FQSEN
    list: IList
}

export const ListContext = React.createContext<ListContextValue>({ manifest: null, file: null, fqsen: null, list: null });

export interface ListContextProviderProps extends FQSENComponentProps {}


interface State {
    items: IListList
    filtered: number[],
    search: string,
    selected: string,
    filters: IListFilters
    // onFiltered: ()
}

export { ListContextProvider };

@hot(module)
@FQSENComponent()
export default class ListContextProvider extends Component<ListContextProviderProps, State> {
    static displayName                                     = 'ListContextProvider';
    static defaultProps: Partial<ListContextProviderProps> = {};
    static contextType                                     = FQSENComponentContext;
    context!: React.ContextType<typeof FQSENComponentContext>;

    state: State = {
        items   : null,
        filtered: [],
        search  : null,
        selected: null,
        filters : {
            public   : false,
            protected: false,
            private  : false,
            static   : false,
            abstract : false,
            final    : false,
            inherited: false,
            name     : null,
        },
    };

    constructor(props: ListContextProviderProps, context: React.ContextType<typeof FQSENComponentContext>) {
        super(props, context);
        this.state.itemList = context.file.entity.members.toList();
        this.state.filtered = this.state.items.keySeq().toArray();
        this.state.search   = null;
    }

    resetFilters = () => {
        this.setState(state => ({
            filtered: this.state.items.keySeq().toArray(),
            search  : null,
        }));
    };

    setSelected = (selected: string | IListItem = null) => {
        if ( typeof selected === 'object' && selected && selected.name ) {
            selected = selected[ 'name' ];
        }
        if ( this.state.selected !== selected ) {
            this.setState(state => ({ selected } as any));
        }
    };

    get selected(): IListItem { return this.state.items[ this.state.selected ]; }

    setSearch = (search: string) => {
        this.setState((state) => ({ search }));
        this.filter();
    };

    setFilter = <N extends keyof IListFilters>(name: N, value: IListFilters[N]) => {
        this.setState(state => ({ filters: { ...state.filters, [ name ]: value } }));
        this.filter();
    };

    isSelected = (item: string | IListItem) => item && typeof item === 'object' && item.name && this.state.selected === item.name;

    filter = () => {
        this.setState(state => {
            const toIndexes = (members: IListItem[]): number[] => members.map(member => state.items.findIndex(item => item.name === member.name));

            const getFilteredMethods = (): PhpdocMethod[] => {
                let methods  = this.context.file.entity.methods as Methods;
                const filter = (filter: (method: api.PhpdocMethod) => boolean) => methods = methods.newInstance(...methods.filter(filter)) as any;
                if ( state.filters.public ) filter((method) => method.visibility !== 'public');
                if ( state.filters.protected ) filter((method) => method.visibility !== 'protected');
                if ( state.filters.private ) filter((method) => method.visibility !== 'private');
                if ( state.filters.static ) filter((method) => ! method.static);
                if ( state.filters.abstract ) filter((method) => ! method.abstract);
                if ( state.filters.final ) filter((method) => ! method.final);
                if ( state.filters.inherited ) filter((method) => ! method.inherited_from || method.inherited_from.length === 0);
                if ( state.search && state.search.length > 0 ) filter((method) => method.name.toLowerCase().indexOf(state.search.toLowerCase()) > - 1);
                return methods.getValues();
            };

            const getFilteredProperties = (): PhpdocProperty[] => {
                let properties = this.context.file.entity.properties as Properties;
                const filter   = (filter: (property: api.PhpdocProperty) => boolean) => properties = properties.newInstance(...properties.filter(filter)) as any;

                if ( state.filters.public ) filter(property => property.visibility !== 'public');
                if ( state.filters.protected ) filter(property => property.visibility !== 'protected');
                if ( state.filters.private ) filter(property => property.visibility !== 'private');
                if ( state.filters.static ) filter(property => ! property.static);
                if ( state.filters.inherited ) filter(property => ! property.inherited_from || property.inherited_from.length === 0);
                if ( state.search && state.search.length > 0 ) filter(property => property.name.toLowerCase().indexOf(state.search.toLowerCase()) > - 1);
                return properties.getValues();
            };

            let members  = [].concat(
                getFilteredProperties(),
                getFilteredMethods(),
            );
            let filtered = toIndexes(members);
            return { filtered };
        });
    };

    getList(): IList {
        const { items, filters, filtered, selected, search }                          = this.state;
        const { setFilter, isSelected, setSearch, setSelected, resetFilters, filter } = this;
        return {
            filters, filtered, search, items,
            setFilter, isSelected, setSearch, setSelected, resetFilters, filter,
            selected: selected ? items.find(item => item.name === selected) : null,

        };
    }

    render() {
        const { children, ...props }    = this.props;
        const { manifest, file, fqsen } = this.context;
        return (
            <ListContext.Provider value={{ manifest, file, fqsen, list: this.getList() }}>
                {children}
            </ListContext.Provider>
        );
    }
}


export interface ListComponentHOCProps extends FQSENComponentProps {}

export function listComponent() {
    return function <T>(TargetComponent: T): T {
        class ListComponentHOC extends Component<ListComponentHOCProps> {
            static displayName = 'ListComponentHOC';

            render() {
                const { children, file, fqsen, ...props } = this.props;
                return (
                    <ListContextProvider fqsen={fqsen} file={file}>
                        {React.createElement(TargetComponent as any, props, children)}
                    </ListContextProvider>
                );
            }
        }

        return ListComponentHOC as any;
    };
}

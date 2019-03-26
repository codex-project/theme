import { isString } from 'lodash';
import { action, observable, transaction } from 'mobx';
import { isMember, PhpdocFile, PhpdocMember, PhpdocMethod, PhpdocProperty } from '../../logic';
import { firstBy, Map } from '@codex/core';

export class PhpdocMembers extends Map<string, PhpdocMember> {
    getMethods(): Map<string, PhpdocMethod> {
        return new Methods(this.filter(member => member.isMethod()));
    }

    getProperties(): Map<string, PhpdocProperty> {
        return new Properties(this.filter(member => member.isProperty()));
    }
}

export class Methods extends Map<string, PhpdocMethod> {}

export class Properties extends Map<string, PhpdocProperty> {}


export interface ItemStoreFilters {
    public?: boolean
    protected?: boolean
    private?: boolean
    static?: boolean
    abstract?: boolean
    final?: boolean
    inherited?: boolean
    name?: string
}

export class ItemStore {
    protected exclude: string | string[] = [];
    public readonly members: PhpdocMembers;

    @observable selected: string          = null;
    @observable search: string            = null;
    @observable visible: string[]         = [];
    @observable length: number            = 0;
    @observable filters: ItemStoreFilters = {
        public   : false,
        protected: false,
        private  : false,
        static   : false,
        abstract : false,
        final    : false,
        inherited: false,
        name     : null,
    };
    sorter: (<T extends PhpdocMember>(items: T[]) => T[]);

    setSorter(cb: (<T extends PhpdocMember>(items: T[]) => T[])) {
        this.sorter = cb;
    };

    get _exclude() { return isString(this.exclude) ? (this.exclude as string).split(',').map(filter => filter.trim()) : this.exclude; }

    constructor(public readonly file: PhpdocFile) {
        this.members = file.entity.members;
        this.setSorter((items) => {
            return items.sort(
                firstBy<PhpdocMember>(v => v.type === 'method', 1)
                    .thenBy(v => v.name === '__construct',-1)
                    .thenBy('static')
                    .thenBy('isInherited'),
            );
        });
        this.filter();
    }

    reset() {
        transaction(() => {
            this.visible  = [];
            this.selected = null;
            this.search   = null;
        });
    }

    @action setSelected(member: string | PhpdocMember) {
        if ( isMember(member) ) {
            member = member.name;
        }
        this.selected = member;
    }

    isSelected(member: string | PhpdocMember) {
        if ( isMember(member) ) {
            member = member.name;
        }
        return this.selected === member;
    }

    setSearch(search: string) {
        transaction(() => {
            this.search = search;
            this.filter();
        });
    }

    setFilters(filters: ItemStoreFilters) {
        transaction(() => {
            this.filters = filters;
            this.filter();
        });
    }

    @action setFilter(name: keyof ItemStoreFilters, value: any) {
        this.filters[ name ] = value;
        this.filter();
    }

    @action mergeFilters(filters: ItemStoreFilters) { this.setFilters({ ...this.filters, ...filters }); }

    sort<T extends PhpdocMember>(items: T[]): T[] {
        return this.sorter ? this.sorter(items) : items;
    }

    filter() {
        transaction(() => {
            let methods    = this.filterMethods();
            let properties = this.filterProperties();
            let members    = methods.toList().concat(properties.toList()).toArray() as PhpdocMember[];
            members        = this.sort(members);
            this.visible   = members.map(member => member.name); // this.visible   = [].concat(methods.keySeq().toArray(), properties.keySeq().toArray());
            this.length    = this.visible.length; // + this.methods.length;
        });
    }

    //region: Settings Dialog Filter methods
    protected filterMethods() {
        let methods  = this.members.getMethods();
        const filter = (filter: (method: PhpdocMethod) => boolean) => {
            methods = methods.filter(filter) as any;
        };
        if ( this.filters.public ) filter((method) => method.visibility !== 'public');
        if ( this.filters.protected ) filter((method) => method.visibility !== 'protected');
        if ( this.filters.private ) filter((method) => method.visibility !== 'private');
        if ( this.filters.static ) filter((method) => ! method.static);
        if ( this.filters.abstract ) filter((method) => ! method.abstract);
        if ( this.filters.final ) filter((method) => ! method.final);
        if ( this.filters.inherited ) filter((method) => ! method.inherited_from || method.inherited_from.length === 0);
        if ( this.search && this.search.length > 0 ) filter((method) => method.name.toLowerCase().indexOf(this.search.toLowerCase()) > - 1);
        return methods;
    }

    protected filterProperties() {
        let properties = this.members.getProperties();
        const filter   = (filter: (property: PhpdocProperty) => boolean) => properties = properties.filter(filter) as any;

        if ( this.filters.public ) filter(property => property.visibility !== 'public');
        if ( this.filters.protected ) filter(property => property.visibility !== 'protected');
        if ( this.filters.private ) filter(property => property.visibility !== 'private');
        if ( this.filters.static ) filter(property => ! property.static);
        if ( this.filters.inherited ) filter(property => ! property.inherited_from || property.inherited_from.length === 0);
        if ( this.search && this.search.length > 0 ) filter(property => property.name.toLowerCase().indexOf(this.search.toLowerCase()) > - 1);
        return properties;
    }

}

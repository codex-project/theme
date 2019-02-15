import { isString } from 'lodash';

import { action, computed, observable, transaction } from 'mobx';
import { Methods, PhpdocFile, PhpdocMethod, PhpdocProperty, Properties } from '../../logic';

export type Member = PhpdocMethod & PhpdocProperty | PhpdocMethod | PhpdocProperty

export interface MemberListFilters {
    public?: boolean
    protected?: boolean
    private?: boolean
    static?: boolean
    abstract?: boolean
    final?: boolean
    inherited?: boolean
    name?: string
}



export class MemberList {
    protected exclude: string | string[]     = [];
    @observable selected: Member             = null;
    @observable search: string               = null;
    @observable methods: PhpdocMethod[]      = [];
    @observable properties: PhpdocProperty[] = [];
    @observable length: number               = 0;

    @computed get items(): Member[] { return [].concat(this.properties, this.methods);}

    @observable filters: MemberListFilters = {
        public   : false,
        protected: false,
        private  : false,
        static   : false,
        abstract : false,
        final    : false,
        inherited: false,
        name     : null,
    };

    get _exclude() { return isString(this.exclude) ? (this.exclude as string).split(',').map(filter => filter.trim()) : this.exclude; }

    constructor(public readonly file: PhpdocFile) {
        this.filter();
    }

    reset() {
        transaction(() => {
            this.properties = [];
            this.methods    = [];
            this.selected   = null;
            this.search     = null;
        });
    }

    map(cb: (item: PhpdocMethod | PhpdocProperty, index: number) => any) {
        return [].concat(this.properties, this.methods).map(cb);
    }

    @action setSelected(member: Member) { this.selected = member; }

    setSearch(search: string) {
        transaction(() => {
            this.search = search;
            this.filter();
        });
    }

    setFilters(filters: MemberListFilters) {
        transaction(() => {
            this.filters = filters;
            this.filter();
        });
    }

    @action setFilter(name: keyof MemberListFilters, value: any) {
        this.filters[ name ] = value;
        this.filter();
    }

    @action mergeFilters(filters: MemberListFilters) { this.setFilters({ ...this.filters, ...filters }); }

    filter() {
        transaction(() => {
            this.filterMethods();
            this.filterProperties();
            this.length = this.properties.length + this.methods.length;
        });
    }

    //region: Settings Dialog Filter methods
    filterMethods() {
        let methods  = this.file.entity.methods as Methods;
        const filter = (filter: (method: PhpdocMethod) => boolean) => methods = methods.newInstance(...methods.filter(filter)) as any;
        if ( this.filters.public ) filter((method) => method.visibility !== 'public');
        if ( this.filters.protected ) filter((method) => method.visibility !== 'protected');
        if ( this.filters.private ) filter((method) => method.visibility !== 'private');
        if ( this.filters.static ) filter((method) => ! method.static);
        if ( this.filters.abstract ) filter((method) => ! method.abstract);
        if ( this.filters.final ) filter((method) => ! method.final);
        if ( this.filters.inherited ) filter((method) => ! method.inherited_from || method.inherited_from.length === 0);
        if ( this.search && this.search.length > 0 ) filter((method) => method.name.toLowerCase().indexOf(this.search.toLowerCase()) > - 1);
        this.methods = methods;
    }

    filterProperties() {
        let properties = this.file.entity.properties as Properties;
        const filter   = (filter: (property: PhpdocProperty) => boolean) => properties = properties.newInstance(...properties.filter(filter)) as any;

        if ( this.filters.public ) filter(property => property.visibility !== 'public');
        if ( this.filters.protected ) filter(property => property.visibility !== 'protected');
        if ( this.filters.private ) filter(property => property.visibility !== 'private');
        if ( this.filters.static ) filter(property => ! property.static);
        if ( this.filters.inherited ) filter(property => ! property.inherited_from || property.inherited_from.length === 0);
        if ( this.search && this.search.length > 0 ) filter(property => property.name.toLowerCase().indexOf(this.search.toLowerCase()) > - 1);
        this.properties = properties as any;

    }

}

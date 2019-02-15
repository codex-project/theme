//@ts-ignore TS2307
import React, { Fragment } from 'react';
import { Checkbox, Input, Popover, Tabs, Tooltip } from 'antd';
import ListItem, { ListItemProps } from './ListItem';
import './member-list.scss';
import { Button, Scrollbar, ucfirst } from '@codex/core';
import { FQNSComponent, FQNSComponentCtx } from '../base';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import PhpdocMethod, { PhpdocMethodSignature } from '../method';
import { IFQSEN, Methods, NamedCollection, PhpdocMethod as PhpdocMethodClass, PhpdocProperty, Properties } from '../../logic';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Observer } from 'mobx-react';
import PhpdocType from '../type';
import { api } from '@codex/api';
import memo from 'memoize-one';
import { isEqual } from 'lodash';
import { hot } from 'react-hot-loader';


const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:PhpdocMemberList');

export type Member = PhpdocMethodClass | PhpdocProperty

export interface PhpdocMemberListProps {
    fqsen: IFQSEN
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;

    scroll?: boolean
    height?: string | number | false

    onItemClick?: (item: Member) => any

    selectable?: boolean
    selected?: Member
    scrollToSelected?: boolean
    onSelect?: (item: Member) => any
    onDeselect?: (item: Member) => any

    searchable?: boolean
    onSearch?: (value: string) => any

    filterable?: boolean
    onFilter?: () => void

    clickableInherits?: boolean
    onInheritedClick?: (item: Member) => any

    gotoSource?: boolean
    onGotoSourceClick?: (item: Member) => any

    sourceModal?: boolean
    noHover?: boolean
}

interface State {

    items: NamedCollection<Member>,
    filtered: number[],
    search: string,
    searchFocus: boolean,
    selected: number,
    filters: {
        public: boolean,
        protected: boolean,
        private: boolean,
        static: boolean,
        abstract: boolean,
        final: boolean,
        inherited: boolean,
        name: string,
    },
}

@hot(module)
@FQNSComponent()
export default class PhpdocMemberList extends React.Component<PhpdocMemberListProps, State> {
    static displayName: string                          = 'PhpdocMemberList';
    static defaultProps: Partial<PhpdocMemberListProps> = {
        scroll           : false,
        height           : '100%',
        selected         : null,
        onItemClick      : () => null,
        onSelect         : () => null,
        onDeselect       : () => null,
        onSearch         : () => null,
        onFilter         : () => null,
        onInheritedClick : () => null,
        onGotoSourceClick: () => null,
    };
    static contextType                                  = FQNSComponentCtx;
    context!: React.ContextType<typeof FQNSComponentCtx>;
    listRef: List                                       = null;
    scrollRef                                           = React.createRef();
    rows: ListRowProps[]                                = [];

    state: State = {
        items      : null,
        filtered   : [],
        search     : null,
        searchFocus: false,
        selected   : null,
        filters    : {
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


    constructor(props: PhpdocMemberListProps, context: React.ContextType<typeof FQNSComponentCtx>) {
        super(props, context);
        let items           = [].concat(
            context.file.entity.properties.getValues(),
            context.file.entity.methods.getValues(),
        );
        this.state.items    = new NamedCollection(...items);
        this.state.filtered = this.state.items.map(item => this.state.items.getIndex(item.name));
        this.state.search   = null;
    }

    resetFilters() {
        this.setState(state => ({
            filtered: state.items.map(item => this.state.items.getIndex(item.name)),
            search  : null,
        }));
    }

    setSelected(selected: string | number | Member = null) {
        if ( typeof selected === 'string' ) {
            selected = this.state.items.getIndex(selected);
        } else if ( typeof selected === 'object' && selected && selected.name ) {
            selected = this.state.items.getIndex(selected[ 'name' ]);
        }
        if ( this.state.selected !== selected ) {
            this.setState(state => ({ selected } as any));
        }
    }

    get selected(): Member { return this.state.items[ this.state.selected ]; }

    setSearch(search) {
        this.setState((state) => ({ search }));
        this.filter();
    }

    setFilter(name, value) {
        this.setState(state => ({ filters: { ...state.filters, [ name ]: value } }));
        this.filter();
    }

    filter() {
        this.setState(state => {
            const toIndexes          = (members: NamedCollection<any>): number[] => members.map(member => state.items.getIndex(member.name));
            const getFilteredMethods = (): Methods => {
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
                return methods;
            };

            const getFilteredProperties = (): Properties => {
                let properties = this.context.file.entity.properties as Properties;
                const filter   = (filter: (property: api.PhpdocProperty) => boolean) => properties = properties.newInstance(...properties.filter(filter)) as any;

                if ( state.filters.public ) filter(property => property.visibility !== 'public');
                if ( state.filters.protected ) filter(property => property.visibility !== 'protected');
                if ( state.filters.private ) filter(property => property.visibility !== 'private');
                if ( state.filters.static ) filter(property => ! property.static);
                if ( state.filters.inherited ) filter(property => ! property.inherited_from || property.inherited_from.length === 0);
                if ( state.search && state.search.length > 0 ) filter(property => property.name.toLowerCase().indexOf(state.search.toLowerCase()) > - 1);
                return properties;
            };

            return {
                filtered: [].concat(
                    toIndexes(getFilteredProperties()),
                    toIndexes(getFilteredMethods()),
                ),
            };
        });
    }

    setSearchFocus = (searchFocus: boolean) => this.setState(state => ({ searchFocus }));

    handleSearch = (value: string) => {
        log('onSearch', value);
        if ( ! this.props.searchable ) {
            return;
        }
        this.setSearch(value.length === 0 ? null : value);
        this.props.onSearch(value);
    };

    handleListItemClick = (item: Member) => {
        log('onItemClick', { item });
        if ( this.props.selectable ) {
            if ( this.isSelected(item) ) {
                this.setSelected(null);
                this.props.onDeselect(item);
            } else {
                this.setSelected(item);
                this.props.onSelect(item);
            }
        }
        this.props.onItemClick(item);
        if ( this.props.selectable ) {
            // this.forceUpdate();
            //     this.listRef.recomputeRowHeights(row.index-1)
        }
    };

    handleFilterChange = (e: CheckboxChangeEvent) => {
        log('onSettingChange', { e });
        this.setFilter(e.target.name as any, e.target.checked === false);
    };

    handleListScroll = (scrollTop, scrollLeft) => {
        // const { scrollTop, scrollLeft } = target;
        const { Grid: grid } = this.listRef;
        grid.handleScrollEvent({ scrollTop, scrollLeft });
    };

    public componentDidMount(): void {
        this.setSelected(this.props.selected);
        this.filter();
    }

    componentDidUpdate(prevProps: Readonly<PhpdocMemberListProps>, prevState, ss) {
        if ( prevProps.selected !== this.props.selected ) {
            this.setSelected(this.props.selected);
        }
    }

    getListItemProps = (item: Member) => {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item,
            selected: this.isSelected(item),
            onClick : this.handleListItemClick,
            gotoSource,
            clickableInherits,
            onInheritedClick,
            onGotoSourceClick,
        } as ListItemProps;
    };

    isSelected = (item: Member) => {
        return this.selected && this.selected.type === item.type && this.selected.name === item.name;
    };

    renderMethodRow = (item) => {
        let isSelected = this.isSelected(item);
        return (
            <Fragment>
                <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                <PhpdocMethodSignature
                    fqsen={item.fqsen}
                    file={this.context.file}
                    inline={true}
                    size={12}
                    noClick={true}
                    hide={{
                        deprecated      : true,
                        inherited       : true,
                        modifiers       : true,
                        argumentDefaults: ! isSelected, //true,
                        namespace       : true,
                        argumentTypes   : ! isSelected, //true,
                        typeTooltip     : true,
                        returns         : ! isSelected, //true,
                    }}
                />
            </Fragment>
        );
    };

    renderPropertyRow = (item) => {
        const extras = item.types ? <PhpdocType className='phpdoc-member-list-item-property-type' type={item.types}/> : null;
        return (
            <Fragment>
                <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                <span className="token property">{item.name}</span>
                {extras}
            </Fragment>
        );
    };

    _rowRenderer = ({ index, style }, item) => {
        let props = this.getListItemProps(item);

        let content = null;
        if ( item.type === 'method' ) {
            content = this.renderMethodRow(item);
        }
        if ( item.type === 'property' ) {
            content = this.renderPropertyRow(item);
        }
        if ( content === null ) {
            return null;
        }
        log('_rowRenderer', { index, style, item });
        return <ListItem {...props} key={index} style={style}>{content}</ListItem>;

    };

    _rowRenderers: any = {};


    render() {
        window[ 'memberlist' ] = this;

        if ( ! this.state || ! this.state.items ) return null;
        let style = {
            height: this.props.height || '100%',
            width : '100%',
            ...this.props.style,
        };


        return (

            <div className={'phpdoc-member-list'} style={style}>
                <AutoSizer style={{  height: '100%',width: '100%' }}>
                    {({ height, width }) => {

                        let showMethod          = this.props.selectable && this.selected && this.selected.type === 'method';
                        let showProperty        = this.props.selectable && this.selected && this.selected.type === 'property';
                        let showList            = ! showMethod && ! showProperty;
                        let { filtered, items } = this.state;

                        return (
                            <Fragment>
                                <If condition={showList}>
                                    <div key="filters" className="hover-filters">{this.renderFilters()}</div>
                                </If>

                                <If condition={showMethod}>
                                    <Scrollbar style={{ height: '100%', width: '100%' }}>
                                        <PhpdocMethod
                                            key="method"
                                            fqsen={this.selected.fqsen}
                                            file={this.context.file}
                                            style={{  height: '100%', width : '100%'}}
                                            signature={
                                                <PhpdocMethodSignature
                                                    fqsen={this.selected.fqsen}
                                                    file={this.context.file}
                                                    size={12}
                                                    className="ant-row-flex-space-between"
                                                    hide={{ namespace: true }}>
                                                    <Button size="small" icon="close" onClick={() => this.setSelected(null)}/>
                                                </PhpdocMethodSignature>
                                            }
                                        />
                                    </Scrollbar>
                                </If>
                                <Scrollbar
                                    style={{ height, width, display: showList ? 'block' : 'none' }}
                                    onUpdate={values => this.handleListScroll(values.scrollTop, values.scrollLeft)}
                                    innerRef={this.scrollRef as any}
                                >

                                    <List
                                        className="phpdoc-member-list-inner"
                                        ref={instance => this.listRef = instance}
                                        height={height}
                                        width={width as any}
                                        rowCount={filtered.length}
                                        rowRenderer={row => {
                                            let itemIndex = filtered[ row.index ] as any;
                                            if ( ! this._rowRenderers[ itemIndex ] ) {
                                                this._rowRenderers[ itemIndex ] = memo((index, style) => this._rowRenderer({ index, style }, items[ itemIndex ]), isEqual);
                                            }
                                            return this._rowRenderers[ itemIndex ](row.index, row.style);
                                        }}
                                        style={{ overflowX: 'visible', overflowY: 'visible' }}
                                        rowHeight={26}
                                    >

                                    </List>
                                </Scrollbar>
                            </Fragment>
                        );
                    }}
                </AutoSizer>
            </div>

        );


        // return this.renderList(height,width,showMethod, showProperty, showList);
    }

    renderFilters() {
        const { searchable, filterable } = this.props;
        return (
            <Fragment>
                <If condition={searchable}>
                    <Search
                        key="search"
                        size="small"
                        placeholder="Search"
                        className={'phpdoc-member-list-search' + (this.state.searchFocus ? ' focus' : '')}
                        onFocus={() => this.setSearchFocus(true)}
                        onBlur={() => this.setSearchFocus(false)}
                        onSearch={this.handleSearch}
                        onChange={e => this.handleSearch(e.target.value)}
                        value={this.state.search}
                    />
                    <If condition={this.state.search && this.state.search.length}>
                        <Tooltip title="Clear search" key="search-clean"> <Button icon="close" size="small" onClick={() => this.setSearch(null)}/> </Tooltip>
                    </If>
                </If>
                <If condition={filterable}>
                    <Popover
                        title="Filters"
                        key="filters-button"
                        content={
                            [ 'public', 'protected', 'private', 'static', 'abstract', 'final', 'inherited' ].map(prop => (
                                <Observer key={prop}>{() =>
                                    <Checkbox
                                        key={prop}
                                        name={prop}
                                        defaultChecked={this.state.filters[ prop ] === false}
                                        style={{ display: 'block', marginLeft: 0 }}
                                        onChange={e => {
                                            this.handleFilterChange(e);
                                            log('checkbox onChange', prop, e.target, this.state.filters[ prop ] === false, '  list.filters[prop]: ', this.state.filters[ prop ]);
                                            // this.
                                        }}
                                    >{ucfirst(prop)}</Checkbox>
                                }</Observer>
                            ))
                        }>
                        <Button icon="filter" size="small" style={{ marginLeft: 3 }}/>
                    </Popover>
                </If>
            </Fragment>
        );
    }

}

//@ts-ignore TS2307
import React, { Fragment } from 'react';
import { Member, MemberList } from './list';
import { observable, runInAction } from 'mobx';
import { Checkbox, Input, Popover, Tabs, Tooltip } from 'antd';
import ListItem, { ListItemProps } from './ListItem';
import './member-list.scss';
import { Button, Scrollbar, ucfirst } from '@codex/core';
import { FQNSComponent, FQNSComponentCtx } from '../base';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import PhpdocMethod, { PhpdocMethodSignature } from '../method';
import { IFQSEN, PhpdocFile, PhpdocMethod as PhpdocMethodClass, PhpdocProperty } from '../../logic';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Observer, observer } from 'mobx-react';
import PhpdocType from '../type';

const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:PhpdocMemberList');

export interface PhpdocMemberListProps {
    fqsen: IFQSEN
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;

    scroll?: boolean
    height?: number | false

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

// @hot(module)
@FQNSComponent()
@observer
export default class PhpdocMemberList extends React.Component<PhpdocMemberListProps> {
    static displayName: string                          = 'PhpdocMemberList';
    static defaultProps: Partial<PhpdocMemberListProps> = {
        scroll           : false,
        height           : 300,
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
    @observable list: MemberList                        = null;
    @observable scrollTop: number                       = 0;
    @observable searchFocus: boolean                    = false;


    constructor(props: PhpdocMemberListProps, context: any) {
        super(props, context);
        this.setListFromFile(context.file, props.selected);
    }

    setListFromFile = (file: PhpdocFile, selected?: Member) => {
        runInAction(() => {
            this.list = new MemberList(file);
            if ( selected ) {
                this.list.setSelected(selected);
            }
        });
    };

    setSearchFocus = (focus: boolean) => runInAction(() => this.searchFocus = focus);

    handleSearch = (value: string) => {
        log('onSearch', value);
        if ( ! this.props.searchable ) {
            return;
        }
        this.list.setSearch(value.length === 0 ? null : value);
        this.props.onSearch(value);
    };

    handleItemClick = (item: Member, row: ListRowProps) => {
        log('onItemClick', { item });
        if ( this.props.selectable ) {
            if ( this.list.selected === item ) {
                this.list.setSelected(null);
                this.props.onDeselect(item);
            } else {
                this.list.setSelected(item);
                this.props.onSelect(item);
            }
        }
        this.props.onItemClick(item);
        if ( this.props.selectable ) {
            this.forceUpdate();
            //     this.listRef.recomputeRowHeights(row.index-1)
        }
    };

    handleFilterChange = (e: CheckboxChangeEvent) => {
        log('onSettingChange', { e });
        this.list.setFilter(e.target.name as any, e.target.checked === false);
    };

    handleScroll = ({ target }) => {
        const { scrollTop, scrollLeft } = target;

        const { Grid: grid } = this.listRef;

        grid.handleScrollEvent({ scrollTop, scrollLeft });
    };

    componentDidUpdate(prevProps: Readonly<PhpdocMemberListProps>, prevState, ss) {
        if ( this.context.file && this.props.selected && this.props.selected.full_name !== this.list.selected.full_name ) {
            this.list.setSelected(this.props.selected);
        }
        if ( this.context.file.fqsen.entityName !== this.list.file.fqsen.entityName ) {
            this.setListFromFile(this.context.file, this.props.selected);
        }
    }

    getListItemProps(item: Member, row: ListRowProps) {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item,
            row,
            selected: this.list.selected && this.list.selected.type === item.type && this.list.selected.name === item.name,
            onClick : this.handleItemClick,
            gotoSource,
            clickableInherits,
            onInheritedClick,
            onGotoSourceClick,
        } as ListItemProps;
    }

    renderMethodRow(row: ListRowProps, item: PhpdocMethodClass, props: ListItemProps) {
        //modifiers={props.selected ? false : undefined}
        return (
            <ListItem {...props} key={row.key} style={row.style}>
                <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                <PhpdocMethodSignature
                    fqsen={item.fqsen}
                    key={row.key}
                    inline={true}
                    size={12}
                    noClick={true}
                    hide={{
                        deprecated      : true,
                        inherited       : true,
                        modifiers       : true,
                        argumentDefaults: ! props.selected, //true,
                        namespace       : true,
                        argumentTypes   : ! props.selected, //true,
                        typeTooltip     : true,
                        returns         : ! props.selected, //true,
                    }}
                />
            </ListItem>
        );
    }

    renderPropertyRow(row: ListRowProps, item: PhpdocProperty, props: ListItemProps) {
        const extras = item.types ? <PhpdocType className='phpdoc-member-list-item-property-type' type={item.types}/> : null;
        return (
            <ListItem {...props} key={row.key} style={row.style}>
                <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                <span className="token property">{item.name}</span>
                {extras}
            </ListItem>
        );
    }

    renderRow = (row: ListRowProps) => {
        let item  = this.list.items[ row.index ];
        let props = this.getListItemProps(item, row);

        return (
            <Fragment key={row.key}>
                <If condition={item.type === 'property'}>
                    {this.renderPropertyRow(row, item, props)}
                </If>
                <If condition={item.type === 'method'}>
                    {this.renderMethodRow(row, item as any, props)}
                </If>
            </Fragment>
        );
    };

    renderFilters() {
        const { searchable, filterable } = this.props;
        return (
            <Fragment>
                <If condition={searchable}>
                    <Search
                        key="search"
                        size="small"
                        placeholder="Search"
                        className={'phpdoc-member-list-search' + (this.searchFocus ? ' focus' : '')}
                        onFocus={() => this.setSearchFocus(true)}
                        onBlur={() => this.setSearchFocus(false)}
                        onSearch={this.handleSearch}
                        onChange={e => this.handleSearch(e.target.value)}
                        value={this.list.search}
                    />
                    <If condition={this.list.search && this.list.search.length}>
                        <Tooltip title="Clear search" key="search-clean"> <Button icon="close" size="small" onClick={() => this.list.setSearch(null)}/> </Tooltip>
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
                                        defaultChecked={this.list.filters[ prop ] === false}
                                        style={{ display: 'block', marginLeft: 0 }}
                                        onChange={e => {
                                            this.handleFilterChange(e);
                                            log('checkbox onChange', prop, e.target, this.list.filters[ prop ] === false, '  list.filters[prop]: ', this.list.filters[ prop ]);
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

    render() {
        window[ 'memberlist' ] = this;
        const {}               = this.props;
        if ( ! this.list ) return null;
        let style = {
            height: this.props.height || '100%',
            width : '100%',
            ...this.props.style,
        };
        return (
            <div className={'phpdoc-member-list'} style={style}>
                <AutoSizer style={{ width: '100%' }}>
                    {({ width, height }) => {
                        return (
                            <Observer>{() => {
                                let showList   = true;
                                let showMethod = this.props.selectable && this.list.selected && this.list.selected.type === 'method';
                                showList       = ! showMethod;
                                return (
                                    <Fragment>
                                        <If condition={showList}>
                                            <div key="filters" className="hover-filters">{this.renderFilters()}</div>
                                        </If>

                                        <If condition={showMethod}>
                                            <Scrollbar style={{ height, width }}>
                                                <PhpdocMethod
                                                    fqsen={this.list.selected.fqsen}
                                                    style={{ height, width }}
                                                    signature={
                                                        <PhpdocMethodSignature
                                                            fqsen={this.list.selected.fqsen}
                                                            size={12}
                                                            className="ant-row-flex-space-between"
                                                            hide={{ namespace: true }}>
                                                            <Button size="small" icon="close" onClick={() => this.list.setSelected(null)}/>
                                                        </PhpdocMethodSignature>
                                                    }
                                                />
                                            </Scrollbar>
                                        </If>
                                        <Scrollbar
                                            style={{ height, width, display: showList ? 'block' : 'none' }}
                                            onScroll={this.handleScroll}
                                        >
                                            <List
                                                className="phpdoc-member-list-inner"
                                                ref={instance => this.listRef = instance}
                                                height={height}
                                                width={width}
                                                rowCount={this.list.length}
                                                rowRenderer={this.renderRow}
                                                style={{ overflowX: 'visible', overflowY: 'visible' }}
                                                rowHeight={26}
                                                // rowHeight={info => {
                                                //     let height=26;
                                                //     let item=this.list.items[info.index];
                                                //     if(this.props.selectable && item.type === 'method' && item === this.list.selected){
                                                //         height=300;
                                                //     }
                                                //     return height;
                                                // }}
                                            >

                                            </List>
                                        </Scrollbar>
                                    </Fragment>
                                );
                            }}</Observer>
                        );
                    }}
                </AutoSizer>
            </div>
        );
    }
}

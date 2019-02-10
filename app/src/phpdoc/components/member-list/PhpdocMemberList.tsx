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
import { hot } from 'react-hot-loader';
import { IFQSEN } from '../../logic';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { observer } from 'mobx-react';

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

    tabbed?: boolean

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
    @observable scrollTop: number                       = 0;
    @observable searchFocus: boolean                    = false;

    get list(): MemberList {
        let list = new MemberList(this.context.file);
        list.setSelected(this.props.selected);
        return list;
    }

    setSearchFocus = (focus: boolean) => runInAction(() => this.searchFocus = focus);

    onSearch = (value: string) => {
        log('onSearch', value);
        if ( ! this.props.searchable ) {
            return;
        }
        this.list.setSearch(value.length === 0 ? null : value);
        this.props.onSearch(value);
    };

    onItemClick = (item: Member) => {
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
    };

    onFilterChange = (e: CheckboxChangeEvent) => {
        log('onSettingChange', { e });
        e.preventDefault();
        this.list.mergeFilters({ [ e.target.name ]: e.target.checked === false });
    };

    renderRow = (row: ListRowProps) => {
        let item  = this.list.items[ row.index ];
        let props = this.getListItemProps(item);

        return (
            <Fragment key={row.key}>
                <If condition={item.type === 'property'}>
                    <ListItem {...props} key={row.key} style={row.style} >
                        <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                        <span className="token property">{item.name}</span>
                    </ListItem>
                </If>
                <If condition={item.type === 'method'}>
                    <Choose>
                        <When condition={props.selected}>
                            <PhpdocMethod
                                fqsen={item.fqsen}
                                key={'_' + row.key}
                                signature={
                                    <PhpdocMethodSignature
                                        fqsen={item.fqsen}
                                        size={12}
                                        className="ant-row-flex-space-between"
                                        hide={{ namespace: true }}>
                                        <Button size="small" icon="close" onClick={() => this.list.setSelected(null)}/>
                                    </PhpdocMethodSignature>
                                }
                            />
                        </When>
                        <Otherwise>
                            <ListItem {...props} key={row.key} style={row.style} modifiers={props.selected ? false : undefined}>
                                <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                                <PhpdocMethodSignature
                                    fqsen={item.fqsen}
                                    key={row.key}
                                    inline={true}
                                    size={12}
                                    noClick={true}
                                    hide={{
                                        modifiers       : true,
                                        argumentDefaults: true,
                                        namespace       : true,
                                        deprecated      : true,
                                        argumentTypes   : true,
                                        typeTooltip     : true,
                                        returns         : true,
                                    }}
                                />
                            </ListItem>
                        </Otherwise>
                    </Choose>
                </If>
            </Fragment>
        );
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
    }

    getListItemProps(item: Member) {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item,
            selected: this.list.selected && this.list.selected.type === item.type && this.list.selected.name === item.name,
            // onClick : this.onItemClick,
            gotoSource,
            clickableInherits,
            onInheritedClick,
            onGotoSourceClick,
        } as ListItemProps;
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
                        className={'phpdoc-member-list-search' + (this.searchFocus ? ' focus' : '')}
                        onFocus={() => this.setSearchFocus(true)}
                        onBlur={() => this.setSearchFocus(false)}
                        onSearch={this.onSearch}
                        onChange={e => this.onSearch(e.target.value)}
                        value={this.list.search}
                    />
                    <Tooltip title="Clear search" key="search-clean"> <Button icon="close-circle-o" size="small" onClick={() => this.list.setSearch(null)}/> </Tooltip>
                </If>
                <If condition={filterable}>
                    <Popover
                        title="Filters"
                        key="filters-button"
                        content={
                            [ 'public', 'protected', 'private', 'static', 'abstract', 'final', 'inherited' ].map(prop => (
                                <Checkbox
                                    key={prop}
                                    name={prop}
                                    checked={this.list.filters[ prop ] === false}
                                    style={{ display: 'block', marginLeft: 0 }}
                                    onChange={this.onFilterChange}
                                >{ucfirst(prop)}</Checkbox>
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
        const { tabbed }       = this.props;
        if ( ! this.list ) return null;
        let style = {
            height: this.props.height || '100%',
            width : '100%',
            ...this.props.style,
        };
        return (
            <div className={'phpdoc-member-list'} style={style}>
                <div key="filters" className="hover-filters">{this.renderFilters()}</div>
                <AutoSizer style={{ width: '100%' }}>
                    {({ width, height }) => {
                        return (
                            <Scrollbar
                                style={{ height, width }}
                                onScroll={this.handleScroll}
                            >
                                <List
                                    className="phpdoc-member-list-inner"
                                    ref={instance => this.listRef = instance}
                                    height={height}
                                    width={width}
                                    rowCount={this.list.length}
                                    rowHeight={26}
                                    rowRenderer={this.renderRow}
                                    style={{ overflowX: 'visible', overflowY: 'visible' }}
                                >

                                </List>
                            </Scrollbar>
                        );
                    }}
                </AutoSizer>
            </div>
        );
    }
}

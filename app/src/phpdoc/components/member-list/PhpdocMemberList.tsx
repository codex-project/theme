//@ts-ignore TS2307
import React from 'react';
import { Member, MemberList } from './list';
import { observable } from 'mobx';
import { Input, Tabs, Tooltip } from 'antd';
import ListItem, { ListItemProps } from './ListItem';
import './member-list.scss';
import { PhpdocFileProviderProps } from '../providers';
import {  Scrollbar } from '@codex/core';
import { FQNSComponent, FQNSComponentCtx } from '../base';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { PhpdocMethodSignature } from '../method';
import { hot } from 'react-hot-loader';

const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:PhpdocMemberList');

export interface PhpdocMemberListProps extends PhpdocFileProviderProps {
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

@hot(module)
@FQNSComponent()
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

    get list(): MemberList {
        let list = new MemberList(this.context.file);
        list.setSelected(this.props.selected);
        return list;
    }

    @observable scrollTop: number    = 0;
    @observable searchFocus: boolean = false;

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

    renderRow    = (props: ListRowProps) => {
        let item = this.list.items[ props.index ];
        return (
            <ListItem key={props.key} style={props.style} {...this.getListItemProps(item)}>
                <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                <If condition={item.type === 'property'}>
                    <span className="token property">{item.name}</span>
                </If>
                <If condition={item.type === 'method'}>
                    <PhpdocMethodSignature
                        fqsen={item.fqsen}
                        key={props.key}
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
                        }}
                    />
                </If>
            </ListItem>
        );
    };
    handleScroll = ({ target }) => {
        const { scrollTop, scrollLeft } = target;

        const { Grid: grid } = this.listRef;

        grid.handleScrollEvent({ scrollTop, scrollLeft });
    };

    listRef: List = null;

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

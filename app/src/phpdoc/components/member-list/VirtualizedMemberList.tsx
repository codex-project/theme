//@ts-ignore TS2307
import React, { Fragment } from 'react';
import { Input, Tabs } from 'antd';
import ListItem, { ListItemProps } from './ListItem';
import './member-list.scss';
import { Button, Scrollbar } from '@codex/core';
import { AutoSizer, List } from 'react-virtualized';
import {PhpdocMethod, PhpdocMethodSignature } from '../method';
import { PhpdocMethod as PhpdocMethodClass, PhpdocProperty } from '../../logic';
import memo from 'memoize-one';
import { isEqual } from 'lodash';
import { hot } from 'react-hot-loader';
import { IList, listComponent, ListContext, ListContextProviderProps } from './ListContext';
import ListFilters, { ListFiltersProps } from './ListFilters';
import PropertyItem from './PropertyItem';
import MethodItem from './MethodItem';


const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:VirtualizedMemberList');

export type Member = PhpdocMethodClass | PhpdocProperty

export interface VirtualizedMemberListProps extends Partial<ListContextProviderProps>, ListFiltersProps {
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

    clickableInherits?: boolean
    onInheritedClick?: (item: Member) => any

    gotoSource?: boolean
    onGotoSourceClick?: (item: Member) => any

    sourceModal?: boolean
    noHover?: boolean
}

interface State {
}

@hot(module)
@listComponent()
export default class VirtualizedMemberList extends React.Component<VirtualizedMemberListProps, State> {
    static displayName: string                          = 'VirtualizedMemberList';
    static defaultProps: Partial<VirtualizedMemberListProps> = {
        scroll           : false,
        height           : '100%',
        selected         : null,
        onItemClick      : () => null,
        onSelect         : () => null,
        onDeselect       : () => null,
        onInheritedClick : () => null,
        onGotoSourceClick: () => null,

        onSearch: () => null,
        onFilter: () => null,
    };
    static contextType                                  = ListContext;
    context!: React.ContextType<typeof ListContext>;
    listRef: List                                       = null;
    scrollRef                                           = React.createRef();
    _rowRenderers: any                                  = {};

    state: State = {};

    get list(): IList {return this.context.list;}

    componentDidMount(): void {
        this.list.setSelected(this.props.selected);
        this.list.filter();
    }

    componentDidUpdate(prevProps: Readonly<VirtualizedMemberListProps>, prevState, ss) {
        if ( prevProps.selected !== this.props.selected ) {
            this.list.setSelected(this.props.selected);
        }
    }

    handleListItemClick = (item: Member) => {
        log('onItemClick', { item });
        if ( this.props.selectable ) {
            if ( this.list.isSelected(item) ) {
                this.list.setSelected(null);
                this.props.onDeselect(item);
            } else {
                this.list.setSelected(item);
                this.props.onSelect(item);
            }
        }
        this.props.onItemClick(item);
    };

    handleListScroll = (scrollTop, scrollLeft) => {
        const { Grid: grid } = this.listRef;
        grid.handleScrollEvent({ scrollTop, scrollLeft });
    };

    getListItemProps = (item: Member) => {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick,
            selected: this.list.isSelected(item),
            onClick : this.handleListItemClick,
        } as ListItemProps;
    };

    _rowRenderer = ({ index, style }, item) => {
        let props = this.getListItemProps(item);

        let content = null;
        if ( item.type === 'method' ) {
            content = <MethodItem item={item}/>;
        }
        if ( item.type === 'property' ) {
            content = <PropertyItem item={item}/>;
        }
        if ( content === null ) {
            return null;
        }
        log('_rowRenderer', { index, style, item });
        return <ListItem {...props} key={index} style={style}>{content}</ListItem>;
    };


    render() {
        window[ 'memberlist' ] = this;
        let style              = {
            height: this.props.height || '100%',
            width : '100%',
            ...this.props.style,
        };
        return (
            <div className={'phpdoc-member-list'} style={style}>
                <AutoSizer style={{ height: '100%', width: '100%' }}>
                    {({ height, width }) => {
                        let showMethod          = this.props.selectable && this.list.selected && this.list.selected.type === 'method';
                        let showProperty        = this.props.selectable && this.list.selected && this.list.selected.type === 'property';
                        let showList            = ! showMethod && ! showProperty;
                        let { filtered, items } = this.context.list;
                        return (
                            <Fragment>
                                <If condition={showList}>
                                    <div key="filters" className="hover-filters">
                                        <ListFilters
                                            filterable={this.props.filterable}
                                            searchable={this.props.searchable}
                                            onFilter={this.props.onFilter}
                                            onSearch={this.props.onSearch}
                                        />
                                    </div>
                                </If>
                                <If condition={showMethod}>
                                    <Scrollbar style={{ height: '100%', width: '100%' }}>
                                        <PhpdocMethod
                                            key="method"
                                            fqsen={this.list.selected.fqsen}
                                            file={this.context.file}
                                            style={{ height: '100%', width: '100%' }}
                                            signature={
                                                <PhpdocMethodSignature
                                                    fqsen={this.list.selected.fqsen}
                                                    file={this.context.file}
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
                                                this._rowRenderers[ itemIndex ] = memo((index, style) => this._rowRenderer({ index, style }, items.get(itemIndex)), isEqual);
                                            }
                                            return this._rowRenderers[ itemIndex ](row.index, row.style);
                                        }}
                                        style={{ overflowX: 'visible', overflowY: 'visible' }}
                                        rowHeight={26}
                                    />
                                </Scrollbar>
                            </Fragment>
                        );
                    }}
                </AutoSizer>
            </div>

        );
    }
}

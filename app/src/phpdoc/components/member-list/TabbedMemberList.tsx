//@ts-ignore TS2307
import React from 'react';
import { Input, Tabs } from 'antd';
import ListItem, { ListItemProps } from './ListItem';
import './member-list.scss';
import { Scrollbar } from '@codex/core';
import { PhpdocMethod as PhpdocMethodClass, PhpdocProperty } from '../../logic';
import { hot } from 'react-hot-loader';
import { IList, listComponent, ListContext, ListContextProviderProps } from './ListContext';
import { ListFiltersProps } from './ListFilters';
import PropertyItem from './PropertyItem';
import MethodItem from './MethodItem';


const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:TabbedMemberList');

export type Member = PhpdocMethodClass | PhpdocProperty

export interface TabbedMemberListProps extends Partial<ListContextProviderProps>, ListFiltersProps {
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

@hot(module)
@listComponent()
export default class TabbedMemberList extends React.Component<TabbedMemberListProps> {
    static displayName: string                          = 'TabbedMemberList';
    static defaultProps: Partial<TabbedMemberListProps> = {
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

    get list(): IList {return this.context.list;}

    componentDidMount(): void {
        this.list.setSelected(this.props.selected);
        this.list.filter();
    }

    componentDidUpdate(prevProps: Readonly<TabbedMemberListProps>, prevState, ss) {
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

    getListItemProps = (item: Member) => {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick,
            selected: this.list.isSelected(item),
            onClick : this.handleListItemClick,
        } as ListItemProps;
    };


    render() {
        window[ 'memberlist' ]  = this;
        let style               = {
            height: this.props.height || '100%',
            width : '100%',
            ...this.props.style,
        };
        let showMethod          = this.props.selectable && this.list.selected && this.list.selected.type === 'method';
        let showProperty        = this.props.selectable && this.list.selected && this.list.selected.type === 'property';
        let showList            = ! showMethod && ! showProperty;
        let { filtered, items } = this.context.list;
        return (
            <div className={'phpdoc-member-list'} style={style}>
                <Scrollbar style={{ height: '100%', width: '100%' }}>
                    {filtered.map((itemIndex, index) => {
                        const item  = items.get(itemIndex) as any;
                        const props = this.getListItemProps(item);
                        if ( item.type === 'property' ) {
                            return <ListItem {...props} key={index}><PropertyItem key={index} item={item}/></ListItem>;
                        }
                        if ( item.type === 'method' ) {
                            return <ListItem {...props} key={index}><MethodItem key={index} item={item}/></ListItem>;
                        }
                        return null;
                    })}
                </Scrollbar>
            </div>

        );
    }
}

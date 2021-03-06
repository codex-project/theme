import React, { Component } from 'react';
import './member-list.scss';
// import { IList, IListFilters, IListItem } from './types';
import { Scrollbar } from '@codex/core';
import { ListItemProps } from './ListItem';
import { PropertyListItem, PropertyListItemProps } from './PropertyListItem';
import { MethodListItem, MethodListItemProps } from './MethodListItem';
import { FQSENComponent, FQSENComponentContext, FQSENComponentProps } from '../base';
import { MembersContext } from './MembersContext';
import { ItemStore, ItemStoreFilters } from './ItemStore';
import { observer } from 'mobx-react';
import { div } from 'typestyled-components/dist/elements';
import { FilterControls } from './FilterControls';
import { PhpdocMember } from '../../logic';

const log = require('debug')('phpdoc:members:Members');

export interface PhpdocMemberListProps extends Partial<FQSENComponentProps> {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;

    scrollable?: boolean
    height?: string | number | false

    onItemClick?: (item: PhpdocMember) => any

    selectable?: boolean
    selected?: PhpdocMember
    scrollToSelected?: boolean
    onSelect?: (item: PhpdocMember) => any
    onDeselect?: (item: PhpdocMember) => any

    clickableInherits?: boolean
    onInheritedClick?: (item: PhpdocMember) => any
    gotoSource?: boolean
    onGotoSourceClick?: (item: PhpdocMember) => any

    filterable?: boolean
    noHover?: boolean

    methods?: { hide?: MethodListItemProps['hide'] }
    properties?: { hide?: PropertyListItemProps['hide'] }

}

export interface PhpdocMemberListWithFilterProps extends PhpdocMemberListProps {
    filterable: true
    searchable?: boolean
    onSearch?: (value: string) => any
    onFilter?: (list: ItemStore) => void
    defaultFilters?: Array<keyof ItemStoreFilters>
}

@FQSENComponent()
@observer
export class PhpdocMemberList<T extends PhpdocMemberListProps> extends Component<T> {
    static displayName                                  = 'Members';
    static defaultProps: Partial<PhpdocMemberListProps> = {
        scrollable       : false,
        height           : '100%',
        selected         : null,
        onItemClick      : () => null,
        onSelect         : () => null,
        onDeselect       : () => null,
        onInheritedClick : () => null,
        onGotoSourceClick: () => null,

        onSearch  : () => null,
        onFilter  : () => null,
        properties: {},
        methods   : {},
    };
    static contextType                                  = FQSENComponentContext;
    context!: React.ContextType<typeof FQSENComponentContext>;
    itemStore: ItemStore;

    constructor(props, context: React.ContextType<typeof FQSENComponentContext>) {
        super(props, context);
        this.itemStore = new ItemStore(context.file);
    }

    render() {
        window[ 'memberlist' ]          = this;
        const { scrollable }            = this.props;
        const { file, fqsen, manifest } = this.context;
        let style                       = {
            height: this.props.height || '100%',
            width : '100%',
            ...this.props.style,
        };

        let inner = (
            <div className="phpdoc-member-list-inner">
                <If condition={this.isFilterable()}>
                    {this.renderFilters()}
                </If>
                {this.renderItems()}
            </div>
        );

        if ( scrollable ) {
            inner = <Scrollbar style={{ height: '100%', width: '100%' }}>{inner}</Scrollbar>;
        }

        return (
            <div className={'phpdoc-member-list'} style={style}>
                <MembersContext.Provider value={{ itemStore: this.itemStore, file, fqsen, manifest }}>
                    {inner}
                </MembersContext.Provider>
            </div>
        );
    }

    isFilterable(): this is Component<PhpdocMemberListWithFilterProps> {
        return this.props.filterable;
    }

    renderFilters() {
        if ( ! this.isFilterable() ) {
            return;
        }
        return (
            <div key="filters" className="hover-filters">
                <FilterControls
                    filterable={this.props.filterable}
                    searchable={this.props.searchable}
                    onFilter={this.props.onFilter}
                    onSearch={this.props.onSearch}
                />
            </div>
        );
    }

    renderItems() {
        const { properties, methods } = this.props;
        return this.itemStore.visible
            .map(key => this.itemStore.members.get(key))
            .map((item, index) => {
                const props = this.getListItemProps(item);
                if ( item.isProperty() ) {
                    return <PropertyListItem  {...props} hide={properties.hide} key={index} item={item} modifiers/>;
                }
                if ( item.isMethod() ) {
                    return <MethodListItem {...props} hide={methods.hide} key={index} item={item} modifiers/>;
                }
                return null;
            });
    }

    handleListItemClick = (item: PhpdocMember) => {
        log('onItemClick', { item });
        if ( this.props.selectable ) {
            if ( this.itemStore.isSelected(item) ) {
                this.itemStore.setSelected(null);
                this.props.onDeselect(item);
            } else {
                this.itemStore.setSelected(item);
                this.props.onSelect(item);
            }
        }
        this.props.onItemClick(item);
    };

    getListItemProps = (item: PhpdocMember) => {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;//, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick,
            selected: this.itemStore.isSelected(item),
            onClick : this.handleListItemClick,
        } as ListItemProps;
    };
}

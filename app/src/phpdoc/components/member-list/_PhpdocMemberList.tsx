//@ts-ignore TS2307
import React from 'react';
import { Member, MemberList } from './list';
import { observable, runInAction } from 'mobx';
import { Button, Checkbox, Input, Popover, Tabs, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox';
import ListItem, { ListItemProps } from './ListItem';
import './member-list.scss';
import { PhpdocFileProviderProps } from '../providers';
import { hot, Scrollbar, ucfirst } from '@codex/core';
import PhpdocMethod from '../method';
import { FQSEN } from '../../logic';
import { FQNSComponent, FQNSComponentCtx } from '../base';
import PhpdocMethodSignature from '../method/PhpdocMethodSignature';

const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:PhpdocMemberList');

export interface PhpdocMemberListProps extends PhpdocFileProviderProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;

    scroll?: boolean
    height?: number | string

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

/**
 * PhpdocMemberList component
 */
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

    // @computed
    // @observable

    get list(): MemberList {
        let list = new MemberList(this.context.file);
        list.setSelected(this.props.selected);
        return list;
    }

    @observable searchFocus: boolean = false;

    public componentDidMount(): void {
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

    renderWithScroller(content) {
        if ( ! this.props.scroll ) return content;
        return <Scrollbar style={{ height: this.props.height }}>{content}</Scrollbar>;
    }

    componentDidUpdate(prevProps: Readonly<PhpdocMemberListProps>, prevState, ss) {
        if ( this.context.file && this.props.selected && this.props.selected.full_name !== this.list.selected.full_name ) {
            this.list.setSelected(this.props.selected);
        }
    }

    public shouldComponentUpdate(nextProps: Readonly<PhpdocMemberListProps>, nextState: Readonly<{ fqsen: FQSEN }>, nextContext: any): boolean {
        if ( ! FQSEN.from(nextState.fqsen).equals(FQSEN.from(this.context.fqsen)) ) {
            return true;
        }
        if ( nextContext.file.hash !== this.context.file.hash ) {
            return true;
        }
        return false;
    }

    getListItemProps(item: Member) {
        let { onItemClick, gotoSource, clickableInherits, onInheritedClick, onGotoSourceClick } = this.props;
        return {
            item,
            selected: this.list.selected && this.list.selected.type === item.type && this.list.selected.name === item.name,
            onClick : this.onItemClick,
            gotoSource,
            clickableInherits,
            onInheritedClick,
            onGotoSourceClick,
        } as ListItemProps;
    }

    renderMethods() {

        return this.list.methods.map((item, numItem) => {
            let props = this.getListItemProps(item);
            return (
                <Choose>
                    <When condition={props.selected}>
                        <PhpdocMethod
                            fqsen={item.fqsen}
                            key={'_' + numItem}
                            signature={
                                <PhpdocMethod.Signature
                                    fqsen={item.fqsen}
                                    size={12}
                                    className="ant-row-flex-space-between"
                                    hide={{ namespace: true }}>
                                    <Button size="small" icon="close" onClick={() => this.list.setSelected(null)}/>
                                </PhpdocMethod.Signature>
                            }
                        />
                    </When>
                    <Otherwise>
                        <ListItem key={numItem} {...props} modifiers={props.selected ? false : undefined}>
                            <Tooltip key={numItem + 'tooltip'} title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                            <PhpdocMethodSignature
                                fqsen={item.fqsen}
                                key={numItem + 'sig'}
                                inline={true}
                                size={12}
                                noClick={true}
                                hide={{
                                    modifiers       : true,
                                    argumentDefaults: true,
                                    namespace       : true,
                                    deprecated      : true,
                                }}
                            />
                        </ListItem>
                    </Otherwise>
                </Choose>
            );
        });
    }

    renderProperties() {
        return this.list.properties.map((item, numItem) => {
            return (
                <ListItem key={numItem} {...this.getListItemProps(item)}>
                    <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                    <span className="token property">{item.name}</span>
                </ListItem>
            );
        });
    }

    renderFilters() {
        const { searchable, filterable } = this.props;
        return [
            searchable ?
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
            /> : null,
            searchable ? <Tooltip title="Clear search" key="search-clean"> <Button icon="close-circle-o" size="small" onClick={() => this.list.setSearch(null)}/> </Tooltip> : null,
            filterable ?
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
            </Popover> : null,
        ];
    }

    renderTabbed() {
        return (
            <Tabs
                defaultActiveKey="methods"
                size="small"
                tabBarStyle={{ marginBottom: 0 }}
                tabBarExtraContent={this.renderFilters()}
            >
                <TabPane tab="Methods" key="methods">
                    {this.renderWithScroller(<ul>{this.renderMethods()}</ul>)}
                </TabPane>
                <TabPane tab="Properties" key="properties">
                    {this.renderWithScroller(<ul>{this.renderProperties()}</ul>)}
                </TabPane>
            </Tabs>
        );
    }

    renderDefault() {

        return this.renderWithScroller([
            <div key="filters" className="hover-filters">{this.renderFilters()}</div>,
            <ul key="list" className="member-list">
                {this.renderProperties()}
                {this.renderMethods()}
            </ul>,
        ]);
    }

    render() {
        window[ 'memberlist' ] = this;
        const { tabbed }       = this.props;
        if ( ! this.list ) return null;
        let style = {
            height: this.props.height,
            ...this.props.style
        }
        return (
            <div className={'phpdoc-member-list'} style={style}>
                {tabbed ?
                 this.renderTabbed() :
                 this.renderDefault()
                }
            </div>
        );
    }
}

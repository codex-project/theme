import React, { Component, Fragment } from 'react';
import { IList, IListFilters } from './types';
import { Checkbox, Input, Popover, Tabs, Tooltip } from 'antd';
import { Button, ucfirst } from '@codex/core';
import { Observer } from 'mobx-react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { MembersContext } from './MembersContext';
import { ItemStore, ItemStoreFilters } from './ItemStore';

const log = require('debug')('phpdoc:components:ListFilters');

const TabPane = Tabs.TabPane;
const Search  = Input.Search;


export interface FilterControlsProps {

    searchable?: boolean
    onSearch?: (value: string) => any

    filterable?: boolean
    onFilter?: (list: ItemStore) => void
    defaultFilters?: Array<keyof ItemStoreFilters>
}

interface State {
    searchFocus: boolean
}

export class FilterControls extends Component<FilterControlsProps, State> {
    static displayName                                = 'FilterControls';
    static defaultProps: Partial<FilterControlsProps> = {
        onSearch: () => null,
        onFilter: () => null,
    };
    static contextType                                = MembersContext;
    context!: React.ContextType<typeof MembersContext>;
    state: State                                      = {
        searchFocus: false,
    };

    get itemStore(): ItemStore {return this.context.itemStore;}

    constructor(props: FilterControlsProps, context: React.ContextType<typeof MembersContext>) {
        super(props, context);
        if ( props.defaultFilters && props.defaultFilters.length ) {
            props.defaultFilters.forEach(name => context.itemStore.setFilter(name, true));
        }
    }

    setSearchFocus = (searchFocus: boolean) => this.setState(state => ({ searchFocus }));

    handleSearch = (value: string) => {
        log('onSearch', value);
        if ( ! this.props.searchable ) {
            return;
        }
        this.itemStore.setSearch(value.length === 0 ? null : value);
        this.props.onSearch(value);
    };

    handleFilterChange = (e: CheckboxChangeEvent) => {
        this.itemStore.setFilter(e.target.name as any, e.target.checked === false);
        this.props.onFilter(this.itemStore.visible as any);
    };

    render() {
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
                        value={this.itemStore.search}
                    />
                    <If condition={this.itemStore.search && this.itemStore.search.length}>
                        <Tooltip title="Clear search" key="search-clean"> <Button icon="close" size="small" onClick={() => this.itemStore.setSearch(null)}/> </Tooltip>
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
                                        defaultChecked={this.itemStore.filters[ prop ] === false}
                                        style={{ display: 'block', marginLeft: 0 }}
                                        onChange={e => {
                                            this.handleFilterChange(e);
                                            log('checkbox onChange', prop, e.target, this.itemStore.filters[ prop ] === false, '  list.filters[prop]: ', this.itemStore.filters[ prop ]);
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


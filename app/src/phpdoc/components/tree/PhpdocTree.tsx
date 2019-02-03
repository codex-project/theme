import React from 'react';
import { observer } from 'mobx-react';
import { classes, style } from 'typestyle';
import { Button, Checkbox, Input, Popover, Tooltip } from 'antd';

import { Tree, TreeProps } from './Tree';
import { action, observable, runInAction } from 'mobx';
import InspireTree from 'inspire-tree';
import { findDOMNode } from 'react-dom';
import { debounce } from 'lodash-decorators';
import { ITreeNode } from './interfaces';
import { hot, Scrollbar, ucfirst } from '@codex/core';
import { Scrollbar as ScrollbarClass } from '@codex/core/components/scrollbar/Scrollbar';
import { PhpdocContent } from '../PhpdocContent';
import { TreeBuilder } from './TreeBuilder';

import './PhpdocTree.scss';

const Search = Input.Search;
const log    = require('debug')('components:PhpdocTree');

export interface PhpdocTreeProps extends TreeProps {
    searchable?: boolean
    filterable?: boolean
    scrollToSelected?: boolean
    tree?: InspireTree
}
export {PhpdocTree}
@hot(module)
@observer
export default class PhpdocTree extends React.Component<PhpdocTreeProps> {
    static displayName: string                    = 'PhpdocTree';
    static defaultProps: Partial<PhpdocTreeProps> = {};
    static contextType                            = PhpdocContent.Context;
    context!: React.ContextType<typeof PhpdocContent.Context>;


    private search: typeof Search;
    private scrollbar: ScrollbarClass = React.createRef() as any;

    get tree(): InspireTree {
        if ( this.props.tree ) {
            return this.props.tree;
        }
        let builder = new TreeBuilder(this.context.manifest.files.keyBy('name'), {});
        let tree    = builder.build();
        return tree;
    }

    @observable treeFilters: {
        search: string
        class: boolean
        trait: boolean
        interface: boolean
    } = { search: null, class: false, trait: false, interface: false };

    @action setTreeFilter(name: 'class' | 'trait' | 'interface', value: boolean) {
        this.treeFilters[ name ] = value;
        this.tree.search((node: ITreeNode) => {
            if ( ! [ 'class', 'trait', 'interface' ].includes(node.type) ) return true;
            return this.treeFilters[ node.type ] === false;
        });
    }

    @debounce(400)
    @action
    searchInTree(search: string) {
        search = search === null ? null : search.length === 0 ? null : search;

        if ( this.treeFilters.search !== search ) {
            this.treeFilters.search = search;
        }
        log('searchInTree', { search, selected: this.tree.selected(), lastSelectedNode: this.tree.lastSelectedNode() });
        if ( search === null && this.tree.selected().length > 0 ) {
            let selected = this.tree.selected().get(0) as ITreeNode;
            // this.tree.lastSelectedNode()
            this.tree
                .clearSearch() // clear search, collapses all
                .node(selected.id) //  get current @todo fix this
                .expandParents(); // expand parents
            return;
        }
        this.tree.search(search);
    }

    componentDidMount() {
        this.tree.on('node.selected', (node: ITreeNode) => {
            if ( this.props.scrollToSelected ) {
                let $li = $(`li[data-uid="${node.id}"]`);
                if ( $li.length === 1 ) {
                    let el = findDOMNode(this) as HTMLElement;
                    let li = $li.get(0);
                    let of = li.offsetTop - (el.offsetHeight / 2); // scrolls to element, puts it vertical middle
                    log('selected offset top', { offsetTop: li.offsetTop, $li, el, of });
                    this.scrollbar.scrollbars.scrollTop(of);
                }
            }
        });
    }

    render() {
        const { nodes, searchable, filterable, style, className, ...treeProps } = this.props;
        return (
            <div className={this.getClassName()}>
                <If condition={searchable && filterable}>
                    <div style={{ padding: 5, textAlign: 'right', borderBottom: '1px solid rgba(0, 0, 0, 0.2)', marginBottom: 5, display: 'flex' }}>
                        <If condition={searchable}>
                            <Search
                                ref={ref => this.search = ref as any}
                                key="search"
                                size="small"
                                placeholder="Search"
                                style={{ width: 'auto', flexBasis: 0, flexGrow: 1, minWidth: 50 }}
                                onSearch={value => this.searchInTree(value)}
                                onChange={e => {
                                    runInAction(() => this.treeFilters.search = e.target.value);
                                    this.searchInTree(e.target.value);
                                }}
                                value={this.treeFilters.search}
                            />
                            <Tooltip title="Clear search" key="search-clean">
                                <Button icon="close-circle-o" size="small" onClick={() => this.searchInTree(null)}/>
                            </Tooltip>
                        </If>
                        <If condition={filterable}>
                            <Popover title="Filters" key="filters" content={[ 'class', 'trait', 'interface' ].map(type => (
                                <Checkbox
                                    name={type}
                                    key={type}
                                    checked={this.treeFilters[ type ] === false}
                                    onChange={e => this.setTreeFilter(type as any, ! e.target.checked)}
                                    style={{ display: 'block', marginLeft: 0 }}
                                >{ucfirst(type)}</Checkbox>
                            ))}>
                                <Button icon="filter" size="small" style={{ marginLeft: 3 }}/>
                            </Popover>
                        </If>
                    </div>
                </If>
                <Scrollbar ref={this.scrollbar as any}>
                    <Tree
                        tree={this.tree}
                        {...treeProps}
                        style={{
                            marginRight  : 8,
                            paddingBottom: 40, // @todo this is a workaround for a unfixed bug: if this is removed, the scroll area does not scroll all the way to the bottom. this is caused by the search/filter div
                        }}
                    />
                </Scrollbar>
            </div>
        );
    }

    getClassName() { return classes('phpdoc-tree', style({ marginBottom: '0 !important' }), style(this.props.style), this.props.className); }
}

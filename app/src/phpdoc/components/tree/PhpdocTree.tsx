import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { classes, style } from 'typestyle';
import { Checkbox, Input, Popover, Tooltip } from 'antd';

import Tree, { TreeProps } from './Tree';
import { action, observable, runInAction } from 'mobx';
import { InspireTree } from './InspireTree';
import { debounce } from 'lodash-decorators';
import { Button, scroll, Scrollbar, ucfirst } from '@codex/core';
import { TreeBuilder } from './TreeBuilder';
import { hot } from 'react-hot-loader';

import './PhpdocTree.scss';
import { ManifestContext } from '../base';
import Scrollbars from 'react-custom-scrollbars';
import { TreeNode, TreeNodes } from 'inspire-tree';

const Search = Input.Search;
const log    = require('debug')('components:PhpdocTree');

export interface PhpdocTreeProps extends TreeProps {
    searchable?: boolean
    filterable?: boolean
    scrollToSelected?: boolean
    tree?: InspireTree
    ref?: any
    getTree?: (tree: InspireTree) => void
}


@hot(module)
@observer
export default class PhpdocTree extends React.Component<PhpdocTreeProps> {
    static displayName: string                    = 'PhpdocTree';
    static defaultProps: Partial<PhpdocTreeProps> = {
        getTree: () => null,
    };
    static contextType                            = ManifestContext;
    context!: React.ContextType<typeof ManifestContext>;

    search: typeof Search;
    scrollbar = React.createRef<Scrollbars>();
    tree: InspireTree;


    constructor(props: PhpdocTreeProps, context: any) {
        super(props, context);
        if ( props.tree ) {
            this.tree = props.tree;
        } else {
            let builder = new TreeBuilder(context.manifest.files.keyBy('name'), {
                manifest: context.manifest,
            });
            this.tree   = builder.build();
        }
        props.getTree(this.tree);
    }

    @observable treeFilters: {
        search: string
        class: boolean
        trait: boolean
        interface: boolean
    } = { search: null, class: false, trait: false, interface: false };

    @action setTreeFilter(name: 'class' | 'trait' | 'interface', value: boolean) {
        this.treeFilters[ name ] = value;
        this.updateTreeFilter();
    }

    updateTreeFilter() {
        this.tree.setSyncable(false);
        this.tree.visible().filterBy(node => this.treeFilters[ node.type ]).hide().each(node => {
            node.getParent().hasVisibleChildren() ? node.getParent().show() : node.getParent().hide();
        });
        this.tree.hidden().filterBy(node => ! this.treeFilters[ node.type ]).show().filterBy(node => node.hasChildren() && ! node.hasVisibleChildren()).hide();
        this.tree.setSyncable(true).sync();
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
            let selected = this.tree.selected().get(0) as TreeNode;
            // this.tree.lastSelectedNode()
            this.tree
                .clearSearch() // clear search, collapses all
                .node(selected.id) //  get current @todo fix this
                .expandParents(); // expand parents
            return;
        }
        this.tree.setSyncable(false);
        this.tree.search(search);
        this.updateTreeFilter()

    }

    scrollToNode(node: TreeNode) {
        let $li = $(`li[data-uid="${node.id}"]`);
        if ( $li.length === 1 ) {
            let offsetTop = $li.get(0).offsetTop;
            scroll.animScrollToFn(
                () => this.scrollbar.current.getScrollTop(),
                (top) => this.scrollbar.current.scrollTop(top),
                offsetTop,
                600,
            );
            log('scrollTop offsetTop', offsetTop);
        }
    }

    componentDidMount() {
        this.tree.on('node.selected', (node: TreeNode) => {
            if ( this.props.scrollToSelected ) {
                this.scrollToNode(node);
            }
        });
        if ( this.tree.selected().length ) {
            this.scrollToNode(this.tree.selected().get(0));
        }
    }

    render() {
        window[ 'phpdoctree' ]                                                  = this;
        const { nodes, searchable, filterable, style, className, ...treeProps } = this.props;
        return (
            <div className={this.getClassName()}>
                {this.renderControls()}
                <Scrollbar innerRef={this.scrollbar as any}>
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

    renderControls() {
        const { nodes, searchable, filterable, style, className, ...treeProps } = this.props;
        return (
            <Fragment>
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
                                <Button icon="close" size="small" onClick={() => this.searchInTree(null)}/>
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
            </Fragment>
        );
    }

    getClassName() { return classes('phpdoc-tree', style({ marginBottom: '0 !important' }), style(this.props.style), this.props.className); }
}

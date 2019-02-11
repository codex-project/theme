import React from 'react';
import { TreeNode } from 'inspire-tree';
import { TreeNodes } from './TreeNodes';
import { camelCase, isFunction, upperFirst } from 'lodash';
import { classes, style, types } from 'typestyle';
import '../../styling/vendor/inspire-tree/light.scss';
import { hot } from 'react-hot-loader';
import { InspireTree } from './InspireTree';

const log = require('debug')('components:inspire-tree:Tree');

export interface TreeProps {
    nodes?: any[]
    tree?: InspireTree
    style?: types.NestedCSSProperties
    className?: string
    onChildrenLoaded?: (node: TreeNode) => void
    onDataLoaded?: (nodes: any[]) => void
    onDataLoaderror?: (err: Error) => void
    onModelLoaded?: (node: TreeNode) => void
    onNodeAdded?: (node: TreeNode) => void
    onNodeClick?: (node: TreeNode) => void
    onNodeBlurred?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeChecked?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeCollapsed?: (node: TreeNode) => void
    onNodeDeselected?: (node: TreeNode) => void
    onNodeEdited?: (node: TreeNode) => void
    onNodeExpanded?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeFocused?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeHidden?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeMoved?: (node: TreeNode) => void
    onNodePaginated?: (node: TreeNode) => void
    onNodeRemoved?: (node: TreeNode) => void
    onNodeRestored?: (node: TreeNode) => void
    onNodeSelected?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeShown?: (node: TreeNode) => void
    onNodeSoftremoved?: (node: TreeNode, isLoadEvent: boolean) => void
    onNodeUnchecked?: (node: TreeNode) => void
    onNodeStateChanged?: (node: TreeNode) => void
    onNodePropertyChanged?: (node: TreeNode) => void

}

@hot(module)
export default class Tree extends React.Component<TreeProps> {

    // Initial state
    state = {
        nodes: [],
    };

    // Instance of the tree
    tree: InspireTree = null;


    // When this component mounts, instatiate inspire tree
    componentDidMount() {
        if ( this.props.tree ) {
            this.tree = this.props.tree;
        } else {
            this.tree = new InspireTree({
                data: this.props.nodes as any,
            });
        }
        this.tree.setSyncer(tree => this.setState({ nodes: tree.nodes() }));

        // Set state once the tree has fully loaded our data
        this.tree.on('model.loaded', (...args) => {
            log('model.loaded', args);
            this.tree.sync() //syncNodes();
        });
        this.tree.on('changes.applied', (...args) => {
            log('changes.applied', args);
            this.tree.sync() //syncNodes();
        });


        this.tree.onAny((event, ...args) => {
            let name = 'on' + upperFirst(camelCase(event.toString()));
            if ( isFunction(this.props[ name ]) ) {
                log('on', event.toString(), name, { event, args }, this.props);
                this.props[ name ](...args);
            }
            // log('event', event, args)
        });

        if ( this.tree.loading().length === 0 && this.props.onModelLoaded ) {
            this.props.onModelLoaded(this.tree as any);
        }
        this.tree.sync()
    }

    componentWillUnmount() {
        this.tree.removeAllListeners();
    }

    // Renders the wrapping div and root OL
    render() {
        window[ 'tree' ] = this;
        return (
            <div className={this.getClassName()}>
                <TreeNodes nodes={this.state.nodes}/>
            </div>
        );
    }

    getClassName() { return classes('inspire-tree', style(this.props.style), this.props.className); }
}

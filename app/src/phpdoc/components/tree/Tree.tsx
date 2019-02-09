import React from 'react';
import InspireTree from 'inspire-tree';
import { TreeNodes } from './TreeNodes';
import { camelCase, isFunction, upperFirst } from 'lodash';
import { classes, style, types } from 'typestyle';
import { ITreeNode } from './interfaces';
import '../../styling/vendor/inspire-tree/light.scss';

const log = require('debug')('components:inspire-tree:Tree');

export interface TreeProps {
    nodes?: any[]
    tree?: InspireTree
    style?: types.NestedCSSProperties
    className?: string
    onChildrenLoaded?: (node: ITreeNode) => void
    onDataLoaded?: (nodes: any[]) => void
    onDataLoaderror?: (err: Error) => void
    onModelLoaded?: (node: ITreeNode) => void
    onNodeAdded?: (node: ITreeNode) => void
    onNodeClick?: (node: ITreeNode) => void
    onNodeBlurred?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeChecked?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeCollapsed?: (node: ITreeNode) => void
    onNodeDeselected?: (node: ITreeNode) => void
    onNodeEdited?: (node: ITreeNode) => void
    onNodeExpanded?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeFocused?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeHidden?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeMoved?: (node: ITreeNode) => void
    onNodePaginated?: (node: ITreeNode) => void
    onNodeRemoved?: (node: ITreeNode) => void
    onNodeRestored?: (node: ITreeNode) => void
    onNodeSelected?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeShown?: (node: ITreeNode) => void
    onNodeSoftremoved?: (node: ITreeNode, isLoadEvent: boolean) => void
    onNodeUnchecked?: (node: ITreeNode) => void
    onNodeStateChanged?: (node: ITreeNode) => void
    onNodePropertyChanged?: (node: ITreeNode) => void

}

export class Tree extends React.Component<TreeProps> {

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

        // Set state once the tree has fully loaded our data
        this.tree.on('model.loaded', (...args) => {
            // log('model.loaded', args)
            this.syncNodes();
        });
        this.tree.on('changes.applied', (...args) => {
            // log('changes.applied', args)
            this.syncNodes();
        });


        this.tree.onAny((event, ...args) => {
            let name = 'on' + upperFirst(camelCase(event.toString()));
            if ( isFunction(this.props[ name ]) ) {
                this.props[ name ](...args);
            }
            // log('event', event, args)
        });

        this.syncNodes();
    }

    componentWillUnmount() {
        this.tree.removeAllListeners();
    }


    // Update the state when changes have been made to our nodes
    syncNodes() {
        this.setState({
            nodes: this.tree.nodes(),
        });
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

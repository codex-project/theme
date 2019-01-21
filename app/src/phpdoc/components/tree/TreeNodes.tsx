import React from 'react';
import {TreeNode} from './TreeNode';
import { hot } from '@codex/core';

// A recursive component for rendering an array of tree nodes
// @hot(module)
export class TreeNodes extends React.Component<{ nodes: any[] }> {
    render() {
        const nodes = this.props.nodes.map((node) => <TreeNode key={node.id} node={node}/>);

        return (<ol>{nodes}</ol>);
    }
}


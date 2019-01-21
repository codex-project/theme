import React from 'react';
import { ITree, ITreeNode } from './interfaces';
import { hot } from '@codex/core';

const log = require('debug')('phpdoc:components:tree-node-anchor')

export interface TreeNodeAnchorProps {
    node: ITreeNode
    expanded?: boolean
    text: string
}

// @hot(module)
export class TreeNodeAnchor extends React.Component<TreeNodeAnchorProps> {

    render() {

        let node             = this.props.node;
        let attributes       = node.itree.a.attributes || {};
        attributes.className = attributes.className || ''
        if ( false === attributes.className.includes('title') ) {
            attributes.className += ' title'
        }
        if ( false === attributes.className.includes('icon') ) {
            attributes.className += ' icon'
        }
        attributes.tabIndex     = 1;
        attributes.unselectable = 'on';

        let content = this.props.text,
            icon;

        if ( node[ 'type' ] ) {
            let className = 'phpdoc-type-' + node[ 'type' ];
            if ( false === attributes.className.includes(className) ) {
                attributes.className += ' ' + className
            }
            icon = <i className={className + ' on-left'}/>
        }

        return (
            <a
                data-uid={node.id}
                onBlur={this.onBlur}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
                onDoubleClick={this.onDoubleClick}
                onFocus={this.onFocus}
                {...attributes}>
                {icon ? icon : ''}
                {content}</a>
        );
    }

    onBlur = (event) => {
        log('blur', { self: this, node: this.props.node })

        this.props.node.blur();
    }

    onClick = (event) => {
        let node = this.props.node,
            tree = node.tree() as ITree

        log('click', { self: this, event, node: this.props.node })

        // Define our default handler
        let handler = () => {
            event.preventDefault();

            if ( event.metaKey || event.ctrlKey || event.shiftKey ) {
                tree.disableDeselection();
            }

            if ( event.shiftKey ) {
                tree.deselect()

                let selected = tree.lastSelectedNode();
                if ( selected ) {
                    let [ start, end ] = (tree.boundingNodes as any)(selected as any, node as any)
                    tree.selectBetween(start, end);
                }
            }

            if ( node.selected() ) {
                if ( ! tree.config.selection.disableDirectDeselection ) {
                    node.deselect();
                }
            }
            else {
                node.select();
            }

            tree.enableDeselection();
        };

        // Emit an event with our forwarded MouseEvent, node, and default handler
        tree.emit('node.click', node, handler);

        // Unless default is prevented, auto call our default handler
        if ( ! event.treeDefaultPrevented ) {
            handler();
        }
    }

    onContextMenu = (event) => {
        this.props.node.tree().emit('node.contextmenu', this.props.node);
    }

    onDoubleClick = (event) => {
        let node = this.props.node;
        log('click', { self: this, event, node: this.props.node })


        // Define our default handler
        let handler = () => {
            // Clear text selection which occurs on double click
            node.tree().deselect()

            node.toggleCollapse();
        };

        // Emit an event with our forwarded MouseEvent, node, and default handler
        node.tree().emit('node.dblclick', node, handler);

        // Unless default is prevented, auto call our default handler
        if ( ! event.treeDefaultPrevented ) {
            handler();
        }
    }

    onFocus = (event) => {
        log('click', { self: this, event, node: this.props.node })

        this.props.node.focus();
    }
}

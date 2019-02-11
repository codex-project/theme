import React, { Component } from 'react';
import {TreeNodes} from './TreeNodes';
import { clone, each, isArray, isEmpty, isFunction, isString } from 'lodash';
import {TreeNodeAnchor} from './TreeNodeAnchor';
import { hot } from '@codex/core';
import {TreeNode as TreeNodeNode} from 'inspire-tree'
// @hot(module)
export class TreeNode extends React.Component<{ node: TreeNodeNode }> {
    renderToggle(node) {
        if ( node.children ) {
            return <a className={'toggle icon ' + (node.expanded() ? 'icon-collapse' : 'icon-expand')} onClick={e => node.toggleCollapse()}></a>
        }
    }

    renderChildren(node) {
        if ( node.expanded() && node.hasChildren() ) {
            return <TreeNodes nodes={node.children}/>;
        }
    }

    getClassNames() {
        let node       = this.props.node;
        let state      = node.itree.state;
        let attributes = node.itree.li.attributes;

        // Set state classnames
        let classNames = [];

        // https://jsperf.com/object-keys-vs-each
        each(Object.keys(state), (key) => {
            if ( state[ key ] ) {
                classNames.push(key);
            }
        });

        // Inverse and additional classes
        if ( ! node.hidden() && node.removed() ) {
            classNames.push('hidden');
        }

        if ( node.expanded() ) {
            classNames.push('expanded');
        }

        classNames.push(node.hasOrWillHaveChildren() ? 'folder' : 'leaf');

        // Append any custom class names
        let customClasses: any = (attributes.className || attributes.className) as any;
        if ( isFunction(customClasses) ) {
            customClasses = (customClasses as any)(node as any)
        }

        // Append content correctly
        if ( ! isEmpty(customClasses) ) {
            if ( isString(customClasses) ) {
                // Support periods for backwards compat with hyperscript-formatted classes
                classNames = classNames.concat(customClasses.split(/[\s\.]+/));
            }
            else if ( isArray(customClasses) ) {
                classNames = classNames.concat(customClasses);
            }
        }

        return classNames.join(' ');
    }

    getAttributes() {
        let node             = this.props.node;

        let attributes       = clone(node.itree.li.attributes) || {};
        attributes.className = this.getClassNames();

        // Force internal-use attributes
        attributes[ 'data-uid' ] = node.id;

        return attributes;
    }

    render() {
        const node = this.props.node;

        // Only render if node is available
        if ( node.available() ) {
            return (<li {...this.getAttributes()}>
                <div className='title-wrap'>
                    {this.renderToggle(node)}
                    <TreeNodeAnchor
                        expanded={node.expanded()}
                        node={node}
                        text={node.text}/>
                </div>
                <div className='wholerow'></div>
                {this.renderChildren(node)}
            </li>);
        }

        return null
    }
}


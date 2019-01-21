import sorter from './sorter';
import { TreeBuilder } from './TreeBuilder';
import { ClassTreeNode, TreeNodeData } from './interfaces';
import { getRandomId } from '@codex/core';

export class TreeNodeBuilder extends TreeBuilder {

    public buildNodes(): TreeNodeData[] {
        let classTree = this.getClassTree();

        const recurse = tree => {
            return Object.keys(tree).map(name => {
                const item = tree[ name ];
                const node = this.makeTreeNodeData(name, item);
                if ( tree[ name ] && tree[ name ][ 'type' ] === undefined ) {
                    node.children = recurse(item);
                    node.children.sort(sorter);
                }
                return node;
            });
        };
        return recurse(classTree);
    }

    /**
     * Transforms a ClassTreeNode into a TreeNode which is used as
     * @param {string} text
     * @param {ClassTreeNode} item
     * @returns {TreeNodeData}
     */
    protected makeTreeNodeData(text: string, item: any) {
        let value: Partial<TreeNodeData> = { text };
        if ( item.type && item.hash ) {
            value = { ...value, type: item.type, hash: item.hash, id: item.hash, fullName: item.fullName };
        } else {
            value.type     = 'namespace';
            value.id       = getRandomId(20);
            value.children = [];
        }
        return value as TreeNodeData;
    }

}

import debug from 'debug';
import { cloneDeep } from 'lodash'
import InspireTree, { Config, TreeNode } from 'inspire-tree';
import { ClassTree, ClassTreeLeaf, ClassTreeNode, TreeNodeData } from './interfaces';
import sorter from './sorter';

const log = debug('phpdoc:tree-builder')

export class TreeBuilder {
    constructor(protected files: Record<string, any>,
                protected config: Config = { data: [] as any }) {}

    protected classTree: ClassTree;

    public build(): InspireTree {
        let classTree = this.getClassTree();
        const tree    = this.createTree();

        // builds up a treenodethe tree recursively with nodes
        const recurse = (tree, node: TreeNode) => {
            Object.keys(tree).forEach(name => {
                const item  = tree[ name ];
                const child = node.addChild(this.makeTreeNodeData(name, item));
                if ( ! item.type ) {
                    recurse(item, child)
                }

            })
            node.getChildren().sort(sorter)
        }

        Object.keys(classTree).forEach(name => {
            const item = classTree[ name ];
            const node = tree.addNode(this.makeTreeNodeData(name, item))
            if ( classTree[ name ] && classTree[ name ][ 'name' ] === undefined ) {
                recurse(classTree  [ name ], node);
            }
        })

        return tree;
    }

    /**
     * Returns the class tree
     * @returns {ClassTree}
     */
    protected getClassTree(rebuild: boolean = false): ClassTree {
        if ( this.classTree === undefined || rebuild === true ) {
            log('getTree new start', this.classTree)
            // get the keys of this.files as array which are the full namespaces
            // and for each key/namespace, split the namespace into segments
            // \Codex\Addons\ServiceProvider will be split into [Codex, Addons, ServiceProvider]
            // resulting in a array similar to: [ [Codex, Addons, ServiceProvider], [Codex, Addons, AddonManager], ... ]
            let namespaces = Object.keys(this.files).map(key => key.split('\\').splice(1))
            // The resulting tree object, which is going to be filled by adding in the segments for each namespace we iterate trough
            this.classTree = {}
            // Iterate trough all the namespaces
            for ( let n = 0; n < namespaces.length; n ++ ) {
                // The namespace segments ([Codex, Addons, ServiceProvider])
                let segments: string[]     = namespaces[ n ];
                let current: ClassTreeLeaf = this.classTree;
                // Iterate trough all segments
                for ( let s = 0; s < segments.length; s ++ ) {
                    // The current segment name
                    let segment: string = segments[ s ]
                    let isLastSegment   = s === (segments.length - 1)
                    let namespaceExists = current[ segment ] !== undefined
                    if ( isLastSegment === false && namespaceExists === false ) {
                        // if we are NOT on the last segment of the current segments iteration
                        // if the current segment does not exist on the parent segment, we add it as empty object and set it as our current
                        // this.tree[Codex][Addons] = {}
                        current[ segment ] = {}
                    } else if ( isLastSegment ) {
                        // the current segment is the last of the segments we iterate trough
                        // so we add the class data to this.tree[Codex][Addons][ServiceProvider] = { fullName, hash, name, type }
                        let namespace      = '\\' + segments.join('\\');
                        let entity         = this.files[ namespace ]
                        current[ segment ] = { ...entity, fullName: namespace, text: segment, id: entity.hash }
                    }
                    current = current[ segment ]
                }
            }
        }
        log('getTree end', this.classTree)
        return cloneDeep(this.classTree);
    }

    /**
     * Transforms a ClassTreeNode into a TreeNode which is used as
     * @param {string} text
     * @param {ClassTreeNode} item
     * @returns {TreeNodeData}
     */
    protected makeTreeNodeData(text: string, item: any): TreeNodeData {
        let value: Partial<TreeNodeData> = { text }
        if ( item.type && item.hash ) {
            value = { ...value, type: item.type, hash: item.hash, id: item.hash, fullName: item.name }
        } else {
            value.type = 'namespace'
        }
        return value as TreeNodeData;
    }

    protected createTree(): InspireTree {
        return new InspireTree(cloneDeep(this.config))
    }
}

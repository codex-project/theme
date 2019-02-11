import InspireTree, { Config, NodeConfig, TreeNode } from 'inspire-tree';
import { api } from '@codex/api';

export type ClassTreeLeaf = ClassTree | ClassTreeNode

export interface ClassTree {
    [ segment: string ]: ClassTreeLeaf
}

export interface ClassTreeNode extends api.PhpdocClassFile {
    fullName?: string
}
//
// export type TreeNodeType = 'namespace' | 'class' | 'trait' | 'interface' | 'generic'
//
// export interface TreeNodeData {
//     id: string
//     name: string
//     fullName: string
//     text: string
//     hash: string
//     type: TreeNodeType
//     children?: Array<TreeNodeData>
// }
//
// export type ITreeNode = TreeNode & TreeNodeData & NodeConfig | TreeNode
// export type ITree = InspireTree & { config: Config }

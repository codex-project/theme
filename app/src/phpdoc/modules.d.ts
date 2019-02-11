// noinspection ES6UnusedImports
import InspireTree from 'inspire-tree'
import { PhpdocManifest } from './logic';

declare module '@codex/api/types/types' {
    interface MenuItem {
        phpdoc?:boolean
    }
}
declare module 'inspire-tree' {

    interface Config {
        manifest?:PhpdocManifest
    }

    interface InspireTree {
        opts:Config
    }
    type TreeNodeType = 'namespace' | 'class' | 'trait' | 'interface' | 'generic'

    interface TreeNodeData {
        id: string
        name: string
        fullName: string
        text: string
        hash: string
        type: TreeNodeType
        children?: Array<TreeNodeData>
    }
    interface TreeNode extends TreeNodeData {
        itree?:any
    }

}

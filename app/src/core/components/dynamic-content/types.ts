import { Components } from 'codex-components';

export interface DynamicContentChild {
    component: keyof Components

    [ key: string ]: any
}

export type DynamicContentChildren = DynamicContentChild[];

export function isDynamicChildren(children: any): children is DynamicContentChildren {
    return Array.isArray(children) && children.length > 0 && typeof children[ 0 ].component === 'string';
}

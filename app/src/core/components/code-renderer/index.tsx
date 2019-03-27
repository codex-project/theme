import { CodeRendererProps } from './CodeRenderer';
import React from 'react';
import { loader } from 'components/loader';

export const CodeRenderer:loader.Class<CodeRendererProps> = loader(() => import(
    /* webpackChunkName: "core.components.code-renderer" */
    // /* webpackPrefetch: true */
    './CodeRenderer'
    ));



// const loader = () => import(
//     /* webpackChunkName: "core.components.code-highlight" */
//     // /* webpackPrefetch: true */
//     './CodeRenderer'
//     );
// export type CodeRendererComponent = ComponentType<CodeRendererProps> & {}
//
// export let CodeRenderer: CodeRendererComponent = loadable(loader);
//
// export default CodeRenderer;

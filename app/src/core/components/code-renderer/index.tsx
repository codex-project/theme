import {CodeRenderer, CodeRendererProps } from './CodeRenderer';
import React, { ComponentType } from 'react';
import loadable from '@loadable/component';

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

export {CodeRenderer}

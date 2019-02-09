// import React, { ComponentType } from 'react';
// import loadable from '@loadable/component';
// import { PhpdocMethodSignatureProps } from './PhpdocMethodSignature';
// import { loadStyling } from '../../loadStyling';
// import { PhpdocMethodArgumentsProps } from './PhpdocMethodArguments';
// import { PhpdocMethodProps } from './PhpdocMethod';
//
// const loader = () => Promise.all([
//     import(
//         /* webpackChunkName: "phpdoc.components.method" */
//         // /* webpackPrefetch: true */
//         './PhpdocMethod'
//         ),
//     loadStyling(),
// ]).then(value => value[ 0 ]);
// export type PhpdocMethodComponent = ComponentType<PhpdocMethodProps> & {
//     Arguments?: ComponentType<PhpdocMethodArgumentsProps>
//     Signature?: ComponentType<PhpdocMethodSignatureProps>
// }
//
// export let PhpdocMethod: PhpdocMethodComponent = loadable(loader);
//
// export default PhpdocMethod;
//
// PhpdocMethod.Arguments = loadable(() => loader().then(m => m.PhpdocMethod.Arguments));
// PhpdocMethod.Signature = loadable(() => loader().then(m => m.PhpdocMethod.Signature));


import {PhpdocMethod} from './PhpdocMethod'
export {PhpdocMethod}
export default PhpdocMethod

import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocMethodSignatureProps } from './PhpdocMethodSignature';
import { loadStyling } from '../../loadStyling';
import { PhpdocMethodArgumentsProps } from './PhpdocMethodArguments';
import { PhpdocMethodProps } from './PhpdocMethod';

const loader = (name) => () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.method" */
        /* webpackPrefetch: true */
        `./${name}`
        ),
    loadStyling(),
]).then(async value => value[ 0 ]);


export let PhpdocMethod: ComponentType<PhpdocMethodProps>                   = loadable(loader('PhpdocMethod'));
export let PhpdocMethodSignature: ComponentType<PhpdocMethodSignatureProps> = loadable(loader('PhpdocMethodSignature'));
export let PhpdocMethodArguments: ComponentType<PhpdocMethodArgumentsProps> = loadable(loader('PhpdocMethodArguments'));


// export let PhpdocMethod: ComponentType<PhpdocMethodProps>                   = loadable(() => import('./PhpdocMethod'));
// export let PhpdocMethodSignature: ComponentType<PhpdocMethodSignatureProps> = loadable(() => import('./PhpdocMethodSignature'));
// export let PhpdocMethodArguments: ComponentType<PhpdocMethodArgumentsProps> = loadable(() => import('./PhpdocMethodArguments'));


export default PhpdocMethod;

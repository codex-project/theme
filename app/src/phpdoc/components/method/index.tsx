import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocMethodSignatureProps } from './PhpdocMethodSignature';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "core.components.type" */
        /* webpackPrefetch: true */
        './PhpdocMethodSignature'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocMethodSignatureComponent = ComponentType<PhpdocMethodSignatureProps> & {}

export let PhpdocMethodSignature: PhpdocMethodSignatureComponent = loadable(loader);

export default PhpdocMethodSignature;

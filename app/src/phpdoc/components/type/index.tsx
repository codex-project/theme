import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocTypeProps } from './PhpdocType';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "core.components.type" */
        /* webpackPrefetch: true */
        './PhpdocType'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocTypeComponent = ComponentType<PhpdocTypeProps> & {}

export let PhpdocType: PhpdocTypeComponent = loadable(loader);

export default PhpdocType;

import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
// import PhpdocType,{ PhpdocTypeProps } from './PhpdocType';
import { PhpdocTypeProps } from './PhpdocType';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.type" */
        /* webpackPrefetch: true */
        './PhpdocType'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocTypeComponent = ComponentType<PhpdocTypeProps> & {}

let PhpdocType: PhpdocTypeComponent = loadable(loader);
export {PhpdocType}
export default PhpdocType;


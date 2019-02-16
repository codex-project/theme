import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
// import PhpdocType,{ PhpdocTypeProps } from './PhpdocType';
import { PhpdocTypeProps } from './PhpdocType';
import { loadStyling } from '../../loadStyling';
import PhpdocPopover from '../popover';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.type" */
        // /* webpackPrefetch: true */
        './PhpdocType'
        ),
    loadStyling(),
    PhpdocPopover.loader(),
]).then(async value => value[ 0 ]);
export type PhpdocTypeComponent = ComponentType<PhpdocTypeProps> & {}

let PhpdocType: PhpdocTypeComponent = loadable(loader);
export { PhpdocType };
export default PhpdocType;


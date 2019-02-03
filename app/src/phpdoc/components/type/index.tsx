import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocTypeProps } from './PhpdocType';
import { loadStyling } from '../../loadStyling';
import PhpdocPopover from '../popover';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.type" */
        // /* webpackPrefetch: true */
        './PhpdocType'
        ),
    PhpdocPopover.loader(),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocTypeComponent = ComponentType<PhpdocTypeProps> & {}

export let PhpdocType: PhpdocTypeComponent = loadable(loader);

export default PhpdocType;

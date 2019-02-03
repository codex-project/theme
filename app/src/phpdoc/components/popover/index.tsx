import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocPopoverProps } from './PhpdocPopover';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.popover" */
        // /* webpackPrefetch: true */
        './PhpdocPopover'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocPopoverComponent = ComponentType<PhpdocPopoverProps> & {}

export let PhpdocPopover: PhpdocPopoverComponent = loadable(loader);

export default PhpdocPopover;

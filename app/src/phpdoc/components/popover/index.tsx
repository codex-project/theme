import React, { ComponentType } from 'react';
import { PhpdocPopoverProps } from './PhpdocPopover';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

const _loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.popover" */
        // /* webpackPrefetch: true */
        './PhpdocPopover'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocPopoverComponent = ComponentType<PhpdocPopoverProps> & {
    loader?: typeof _loader
}

export let PhpdocPopover: PhpdocPopoverComponent = loader<PhpdocPopoverProps>([
    _loader,
    () => loadStyling(),
]);

PhpdocPopover.loader = _loader;

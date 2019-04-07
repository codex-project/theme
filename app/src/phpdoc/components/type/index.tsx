import React from 'react';
import { PhpdocTypeProps } from './PhpdocType';
import { loadStyling } from '../../loadStyling';
import {PhpdocPopover} from '../popover';
import { loader } from '@codex/core';


export const PhpdocType :loader.Class<PhpdocTypeProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.type" */
        /* webpackPrefetch: true */
        './PhpdocType'
        ),
    () => loadStyling(),
    PhpdocPopover.loader,
]);

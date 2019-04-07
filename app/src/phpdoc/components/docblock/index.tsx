import React from 'react';
import { PhpdocDocblockProps } from './PhpdocDocblock';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

export const PhpdocDocblock:loader.Class<PhpdocDocblockProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.docblock" */
        // /* webpackPrefetch: true */
        './PhpdocDocblock'
        ),
    () => loadStyling(),
]);

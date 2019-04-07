import React from 'react';
import { PhpdocTagsProps } from './PhpdocTags';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';


export const PhpdocTags:loader.Class<PhpdocTagsProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.tags" */
        // /* webpackPrefetch: true */
        './PhpdocTags'
        ),
    () => loadStyling(),
]);

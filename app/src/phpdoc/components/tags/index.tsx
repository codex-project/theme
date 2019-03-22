import React from 'react';
import { PhpdocTagsProps } from './PhpdocTags';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';


export const PhpdocTags = loader<PhpdocTagsProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components.tags" */
        // /* webpackPrefetch: true */
        './PhpdocTags'
        ),
    () => loadStyling(),
]);

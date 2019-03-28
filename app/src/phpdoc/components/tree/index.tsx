import React from 'react';
import { PhpdocTreeProps } from './PhpdocTree';
import { loadStyling } from '../../loadStyling';
import { TreeBuilder } from './TreeBuilder';
import { loader } from '@codex/core';

export { TreeBuilder };


export const PhpdocTree = loader<PhpdocTreeProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components." */
        /* webpackPrefetch: true */
        './PhpdocTree'
        ),
    () => loadStyling(),
]);

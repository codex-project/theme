import React from 'react';
import { PhpdocEntityProps } from './PhpdocEntity';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

export const PhpdocEntity:loader.Class<PhpdocEntityProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.entity" */
        /* webpackPrefetch: true */
        './PhpdocEntity'
        ),
    () => loadStyling(),
]);

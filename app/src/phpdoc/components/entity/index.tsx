import React from 'react';
import { PhpdocEntityProps } from './PhpdocEntity';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

export const PhpdocEntity = loader<PhpdocEntityProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components.entity" */
        /* webpackPrefetch: true */
        './PhpdocEntity'
        ),
    () => loadStyling(),
]);

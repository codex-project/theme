import React from 'react';
import { PhpdocDrawerProps } from './PhpdocDrawer';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

export const PhpdocDrawer:loader.Class<PhpdocDrawerProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.drawer" */
        /* webpackPrefetch: true */
        './PhpdocDrawer'
        ),
    () => loadStyling(),
]);

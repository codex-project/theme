import React from 'react';
import { PhpdocLinkProps } from './PhpdocLink';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

export const PhpdocLink :loader.Class<PhpdocLinkProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.link" */
        // /* webpackPrefetch: true */
        './PhpdocLink'
        ),
    () => loadStyling(),
]);


// export {PhpdocLink}

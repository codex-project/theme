import React from 'react';
import { PhpdocAppProps } from './PhpdocApp';
import { loadStyling } from '../../loadStyling';
import { loader } from '@codex/core';

export const PhpdocApp = loader<PhpdocAppProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components.app" */
        // /* webpackPrefetch: true */
        './PhpdocApp'
        ),
    () => loadStyling(),
]);


// export const Phpdoc = loader<PhpdocApp>([
//     () => import(
//         /* webpackChunkName: "phpdoc.components." */
//         // /* webpackPrefetch: true */
//         './Phpdoc'
//         ),
//     () => loadStyling(),
// ]);

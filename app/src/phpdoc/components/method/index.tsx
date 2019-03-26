import React from 'react';
import { PhpdocMethodSignatureProps } from './PhpdocMethodSignature';
import { loadStyling } from '../../loadStyling';
import { PhpdocMethodArgumentsProps } from './PhpdocMethodArguments';
import { PhpdocMethodProps } from './PhpdocMethod';
import { loader } from '@codex/core';
//
// const _loader = (name) => () => Promise.all([
//     import(
//         /* webpackChunkName: "phpdoc.components.method" */
//         /* webpackPrefetch: true */
//         `./${name}`
//         ),
//     loadStyling(),
// ]).then(async value => value[ 0 ]);
//
//
// export let PhpdocMethod          = loader<PhpdocMethodProps>(_loader('PhpdocMethod'));
// export let PhpdocMethodSignature = loader<PhpdocMethodSignatureProps>(_loader('PhpdocMethodSignature'));
// export let PhpdocMethodArguments = loader<PhpdocMethodArgumentsProps>(_loader('PhpdocMethodArguments'));

export const PhpdocMethod = loader<PhpdocMethodProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components.method" */
        /* webpackPrefetch: true */
        './PhpdocMethod'
        ),
    loadStyling,
]);

export const PhpdocMethodSignature = loader<PhpdocMethodSignatureProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components.method" */
        /* webpackPrefetch: true */
        './PhpdocMethodSignature'
        ),
    loadStyling,
]);

export const PhpdocMethodArguments = loader<PhpdocMethodArgumentsProps>([
    () => import(
        /* webpackChunkName: "phpdoc.components.method" */
        /* webpackPrefetch: true */
        './PhpdocMethodArguments'
        ),
    loadStyling,
]);





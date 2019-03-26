// import DynamicContent from './DynamicContent';
// export { DynamicContent };

import React from 'react';
import { loader } from 'components/loader';

import { DynamicContentProps } from './DynamicContent';

export const DynamicContent = loader<DynamicContentProps>(() => import(
    /* webpackChunkName: "core.components.dynamic-content" */
    /* webpackPrefetch: true */
    './DynamicContent'
    ),
);


export * from './types';

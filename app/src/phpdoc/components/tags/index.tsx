import { componentLoader } from '@codex/core';
import React from 'react';
import { PhpdocTagsProps } from './PhpdocTags';
import { loadStyling } from '../../loadStyling';


export const PhpdocTags: React.ComponentType<PhpdocTagsProps> = DEV ? require('./PhpdocTags').PhpdocTags :componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "phpdoc.tags" */'./PhpdocTags')).PhpdocTags,
        loadStyling,
    },
    (loader: any, props: any) => <loader.Component {...props} />,
    { delay: 1000 },
);

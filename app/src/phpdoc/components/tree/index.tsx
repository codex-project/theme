import { componentLoader } from '@codex/core';
import React from 'react';
import { PhpdocTreeProps } from './PhpdocTree';
import { loadStyling } from '../../loadStyling';

export * from './TreeBuilder';


export const PhpdocTree:React.ComponentType<PhpdocTreeProps> = DEV ? require('./PhpdocTree').PhpdocTree :componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "phpdoc.tree" */'./PhpdocTree')).PhpdocTree,
        loadStyling,
        // style    : async () => await import(/* webpackChunkName: "phpdoc.tree" */'./PhpdocTree.scss'),
    },
    (loader: any, props: any) => <loader.Component {...props} />,
    { delay: 1000 },
);

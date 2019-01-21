import { componentLoader } from '@codex/core';
import React from 'react';
import { PhpdocEntityProps } from './PhpdocEntity';
import { loadStyling } from '../../loadStyling';


export const PhpdocEntity: React.ComponentType<PhpdocEntityProps> = componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "phpdoc.entity" */'./PhpdocEntity')).PhpdocEntity,
        loadStyling,
    },
    (loader: any, props: any) => <loader.Component {...props} />,
    { delay: 1000 },
);

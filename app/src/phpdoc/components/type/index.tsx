import { componentLoader } from '@codex/core';
import React from 'react';
import { PhpdocTypeProps } from './PhpdocType';
import { loadStyling } from '../../loadStyling';


export const PhpdocType: React.ComponentType<PhpdocTypeProps> = componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "phpdoc.type" */'./PhpdocType')).PhpdocType,
        loadStyling,
    },
    (loader: any, props: any) => <loader.Component {...props} />,
    { delay: 1000 },
);

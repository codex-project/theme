import { componentLoader } from '@codex/core';
import React from 'react';
import { PhpdocDocblockProps } from './PhpdocDocblock';
import { loadStyling } from '../../loadStyling';


export const PhpdocDocblock: React.ComponentType<PhpdocDocblockProps> = DEV ? require('./PhpdocDocblock').PhpdocDocblock : componentLoader(
    {
        Component: async () =>  (await import(/* webpackChunkName: "phpdoc.docblock" */'./PhpdocDocblock')).PhpdocDocblock,
        loadStyling,
    },
    (loader: any, props: any) => <loader.Component {...props} />,
    { delay: 1000 },
);

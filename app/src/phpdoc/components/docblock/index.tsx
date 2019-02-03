import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocDocblockProps } from './PhpdocDocblock';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.docblock" */
        // /* webpackPrefetch: true */
        './PhpdocDocblock'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocDocblockComponent = ComponentType<PhpdocDocblockProps> & {}

export let PhpdocDocblock: PhpdocDocblockComponent = loadable(loader);

export default PhpdocDocblock;

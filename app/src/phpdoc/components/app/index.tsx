import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocAppProps } from './PhpdocApp';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.app" */
        // /* webpackPrefetch: true */
        './PhpdocApp'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocAppComponent = ComponentType<PhpdocAppProps> & {}

export let PhpdocApp: PhpdocAppComponent = loadable(loader);

export default PhpdocApp;

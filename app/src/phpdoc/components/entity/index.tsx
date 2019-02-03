import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocEntityProps } from './PhpdocEntity';
import { loadStyling } from '../../loadStyling';


const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.entity" */
        // /* webpackPrefetch: true */
        './PhpdocEntity'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);

export type PhpdocEntityComponent = ComponentType<PhpdocEntityProps> & {}

export let PhpdocEntity: PhpdocEntityComponent = loadable(loader);

export default PhpdocEntity;


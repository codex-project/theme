import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocTagsProps } from './PhpdocTags';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "core.components.tags" */
        /* webpackPrefetch: true */
        './PhpdocTags'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocTagsComponent = ComponentType<PhpdocTagsProps> & {}

export let PhpdocTags: PhpdocTagsComponent = loadable(loader);

export default PhpdocTags;

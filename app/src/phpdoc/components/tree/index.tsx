import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocTreeProps } from './PhpdocTree';
import { loadStyling } from '../../loadStyling';
import { TreeBuilder } from './TreeBuilder';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "core.components.tree" */
        /* webpackPrefetch: true */
        './PhpdocTree'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocTreeComponent = ComponentType<PhpdocTreeProps> & {}

export let PhpdocTree: PhpdocTreeComponent = loadable(loader);

export default PhpdocTree;
export {TreeBuilder};

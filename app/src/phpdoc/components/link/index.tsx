import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { PhpdocLinkProps } from './PhpdocLink';
import { loadStyling } from '../../loadStyling';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "core.components.link" */
        /* webpackPrefetch: true */
        './PhpdocLink'
        ),
    loadStyling(),
]).then(value => value[ 0 ]);
export type PhpdocLinkComponent = ComponentType<PhpdocLinkProps> & {}

export let PhpdocLink: PhpdocLinkComponent = loadable(loader);

export default PhpdocLink;

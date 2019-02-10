import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { loadStyling } from '../../loadStyling';
import { PhpdocMemberListProps } from './PhpdocMemberList';

const loader = () => Promise.all([
    import(
        /* webpackChunkName: "phpdoc.components.member-list" */
        /* webpackPrefetch: true */
        './PhpdocMemberList'
        ),
    loadStyling(),
]).then(async value => value[ 0 ]);
export type PhpdocMemberListComponent = ComponentType<PhpdocMemberListProps> & {
}

export let PhpdocMemberList: PhpdocMemberListComponent = loadable(loader);

export default PhpdocMemberList;

import React from 'react';
import { loadStyling } from '../../loadStyling';
import { PhpdocMemberListProps } from './PhpdocMemberList';
import { loader } from '@codex/core';

export const PhpdocMemberList :loader.Class<PhpdocMemberListProps> = loader([
    () => import(
        /* webpackChunkName: "phpdoc.components.member-list" */
        /* webpackPrefetch: true */
        './PhpdocMemberList'
        ),
    () => loadStyling(),
]);

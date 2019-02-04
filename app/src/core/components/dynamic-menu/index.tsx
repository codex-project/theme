import { DynamicMenuProps } from './DynamicMenu';
import React, { ComponentType } from 'react';
import loadable from '@loadable/component';

const loader = () => import(
    /* webpackChunkName: "core.components.dynamic-menu" */
    // /* webpackPrefetch: true */
    './DynamicMenu'
    );
export type DynamicMenuComponent = ComponentType<DynamicMenuProps> & {}

export let DynamicMenu: DynamicMenuComponent = loadable(loader);

export default DynamicMenu;

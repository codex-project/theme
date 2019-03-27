import { DynamicMenuProps } from './DynamicMenu';
import React, { ComponentType } from 'react';
import { loader } from 'components/loader';

;
export type DynamicMenuComponent = ComponentType<DynamicMenuProps> & {}

export let DynamicMenu:loader.Class<DynamicMenuProps> = loader(() => import(
    /* webpackChunkName: "core.components.dynamic-menu" */
    /* webpackPrefetch: true */
    './DynamicMenu'
    ));

import React from 'react';
import { ToolbarProps } from './Toolbar';
import { ToolbarItemProps } from './ToolbarItem';
import { ToolbarColumnProps } from './ToolbarColumn';
import { loader } from 'components/loader';

export const Toolbar = loader<ToolbarProps>(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './Toolbar'
    ),
);

export const ToolbarItem = loader<ToolbarItemProps>(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './ToolbarItem'
    ),
);

export const ToolbarSpacer = loader<{}>(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './ToolbarSpacer'
    ),
);

export const ToolbarColumn = loader<ToolbarColumnProps>(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './ToolbarColumn'
    ),
);


export { ToolbarProps, ToolbarItemProps, ToolbarColumnProps };

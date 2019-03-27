import React from 'react';
import { ToolbarProps } from './Toolbar';
import { ToolbarItemProps } from './ToolbarItem';
import { ToolbarColumnProps } from './ToolbarColumn';
import { loader } from 'components/loader';

export const Toolbar:loader.Class<ToolbarProps> = loader(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './Toolbar'
    ),
);

export const ToolbarItem:loader.Class<ToolbarItemProps> = loader(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './ToolbarItem'
    ),
);

export const ToolbarSpacer:loader.Class<{}> = loader(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './ToolbarSpacer'
    ),
);

export const ToolbarColumn:loader.Class<ToolbarColumnProps> = loader(() => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './ToolbarColumn'
    ),
);


export { ToolbarProps, ToolbarItemProps, ToolbarColumnProps };

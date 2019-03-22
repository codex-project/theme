import React, { ComponentType } from 'react';
import { ToolbarProps } from './Toolbar';
import { ToolbarItemProps } from './ToolbarItem';
import { ColProps } from 'antd/lib/col';
import { loader } from 'components/loader';

const _loader = () => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './Toolbar'
    );

export type ToolbarComponent = ComponentType<ToolbarProps> & {
    Item?: ComponentType<ToolbarItemProps>
    Spacer?: ComponentType<{}>
    Column?: ComponentType<ColProps>
}

export let Toolbar: ToolbarComponent = loader(_loader);
export const ToolbarSpacer           = Toolbar.Spacer = loader(() => _loader().then(t => t.Toolbar.Spacer));
export const ToolbarColumn           = Toolbar.Column = loader(() => _loader().then(t => t.Toolbar.Column));
export const ToolbarItem             = Toolbar.Item = loader<ToolbarItemProps>(() => _loader().then(t => t.Toolbar.Item));

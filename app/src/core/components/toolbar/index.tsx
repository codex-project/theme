import React, { ComponentType } from 'react';
import loadable from '@loadable/component';
import { ToolbarProps } from './Toolbar';
import { ToolbarItemProps } from './ToolbarItem';
import { ColProps } from 'antd/lib/col';

const loader = () => import(
    /* webpackChunkName: "core.components.toolbar" */
    /* webpackPrefetch: true */
    './Toolbar'
    );

export type ToolbarComponent = ComponentType<ToolbarProps> & {
    Item?: ComponentType<ToolbarItemProps>
    Spacer?: ComponentType<{}>
    Column?: ComponentType<ColProps>
}

export let Toolbar: ToolbarComponent = loadable(loader);

export default Toolbar;

Toolbar.Spacer = loadable(() => loader().then(t => t.Toolbar.Spacer));
Toolbar.Column = loadable(() => loader().then(t => t.Toolbar.Column));
Toolbar.Item   = loadable(() => loader().then(t => t.Toolbar.Item));

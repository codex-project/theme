import React, { ComponentType } from 'react';
import loadable from '@loadable/component';

import { LayoutProps } from './Layout';
import { LayoutHeaderProps } from './LayoutHeader';
import { LayoutFooterProps } from './LayoutFooter';
import { LayoutSideProps } from './LayoutSide';
import { LayoutBreadcrumbsProps } from './LayoutBreadcrumbs';

const loader = () => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './Layout'
    );

export type LayoutComponent = ComponentType<LayoutProps> & {
    Header?: ComponentType<LayoutHeaderProps>
    Footer?: ComponentType<LayoutFooterProps>
    Side?: ComponentType<LayoutSideProps>
    Breadcrumbs?: ComponentType<LayoutBreadcrumbsProps>
}

export let Layout: LayoutComponent = loadable(() => loader().then(l=>l.Layout));

export default Layout;

Layout.Header      = loadable(() => loader().then(l => l.default.Header));
Layout.Footer      = loadable(() => loader().then(l => l.Layout.Footer));
Layout.Side        = loadable(() => loader().then(l => l.Layout.Side));
Layout.Breadcrumbs = loadable(() => loader().then(l => l.Layout.Breadcrumbs));

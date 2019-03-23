import React, { ComponentType,ComponentClass } from 'react';
import { loader } from 'components/loader';

import { LayoutProps } from './Layout';
import { LayoutHeaderProps } from './LayoutHeader';
import { LayoutFooterProps } from './LayoutFooter';
import { LayoutSideProps } from './LayoutSide';
import { LayoutBreadcrumbsProps } from './LayoutBreadcrumbs';

const _loader = () => import(
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

export let Layout: LayoutComponent                             = loader<LayoutProps>(() => _loader().then(l => l.Layout));
export const LayoutHeader: LayoutComponent['Header']           = Layout.Header = loader<LayoutHeaderProps>(() => _loader().then(l => l.Layout.Header));
export const LayoutFooter: LayoutComponent['Footer']           = Layout.Footer = loader<LayoutFooterProps>(() => _loader().then(l => l.Layout.Footer));
export const LayoutSide: LayoutComponent['Side']               = Layout.Side = loader<LayoutSideProps>(() => _loader().then(l => l.Layout.Side));
export const LayoutBreadcrumbs: LayoutComponent['Breadcrumbs'] = Layout.Breadcrumbs = loader<LayoutBreadcrumbsProps>(() => _loader().then(l => l.Layout.Breadcrumbs));

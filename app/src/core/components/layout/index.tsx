import React from 'react';
import { loader } from 'components/loader';

import { LayoutProps } from './Layout';
import { LayoutHeaderProps } from './LayoutHeader';
import { LayoutFooterProps } from './LayoutFooter';
import { LayoutSideProps } from './LayoutSide';
import { LayoutBreadcrumbsProps } from './LayoutBreadcrumbs';
import { LayoutToolbarProps } from 'components/layout/LayoutToolbar';

export const Layout = loader<LayoutProps>(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './Layout'
    ),
);

export const LayoutHeader = loader<LayoutHeaderProps>(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutHeader'
    ),
);

export const LayoutFooter = loader<LayoutFooterProps>(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutFooter'
    ),
);

export const LayoutSide = loader<LayoutSideProps>(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutSide'
    ),
);

export const LayoutBreadcrumbs = loader<LayoutBreadcrumbsProps>(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutBreadcrumbs'
    ),
);
export const LayoutToolbar     = loader<LayoutToolbarProps>(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutToolbar'
    ),
);

export { LayoutProps, LayoutHeaderProps, LayoutFooterProps, LayoutSideProps, LayoutBreadcrumbsProps, LayoutToolbarProps };

import React from 'react';
import { loader } from 'components/loader';

import { LayoutProps } from './Layout';
import { LayoutHeaderProps } from './LayoutHeader';
import { LayoutFooterProps } from './LayoutFooter';
import { LayoutSideProps } from './LayoutSide';
import { LayoutBreadcrumbsProps } from './LayoutBreadcrumbs';
import { LayoutToolbarProps } from 'components/layout/LayoutToolbar';

export const Layout:loader.Class<LayoutProps> = loader(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './Layout'
    ),
);

export const LayoutHeader:loader.Class<LayoutHeaderProps> = loader(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutHeader'
    ),
);

export const LayoutFooter:loader.Class<LayoutFooterProps> = loader(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutFooter'
    ),
);

export const LayoutSide:loader.Class<LayoutSideProps> = loader(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutSide'
    ),
);

export const LayoutBreadcrumbs:loader.Class<LayoutBreadcrumbsProps> = loader(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutBreadcrumbs'
    ),
);
export const LayoutToolbar:loader.Class<LayoutToolbarProps> = loader(() => import(
    /* webpackChunkName: "core.components.layout" */
    /* webpackPrefetch: true */
    './LayoutToolbar'
    ),
);

export { LayoutProps, LayoutHeaderProps, LayoutFooterProps, LayoutSideProps, LayoutBreadcrumbsProps, LayoutToolbarProps };

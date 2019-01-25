import { componentLoader } from 'utils/componentLoader'
import React from 'react';
import { DynamicMenuProps } from './DynamicMenu';

export * from './DynamicMenu';


export const DynamicMenu: React.ComponentType<DynamicMenuProps> = componentLoader(
    {
        DefaultMenuItemRenderer: async () => (await import(/* webpackChunkName: "core.components.dynamic-menu" */'./DefaultMenuItemRenderer')).DefaultMenuItemRenderer,
        BigMenuItemRenderer    : async () => (await import(/* webpackChunkName: "core.components.dynamic-menu" */'./BigMenuItemRenderer')).BigMenuItemRenderer,
        Component              : async () => (await import(/* webpackChunkName: "core.components.dynamic-menu" */'./DynamicMenu')).DynamicMenu,
        style                  : async () => await import(/* webpackChunkName: "core.components.dynamic-menu" */'./index.scss'),
    },
    ({ Component }, props: any) => <Component {...props} />,
    { delay: 1000 },
);

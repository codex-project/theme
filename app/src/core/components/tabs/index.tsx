import React from 'react';
import loadable from '@loadable/component';
import { TabsProps } from './Tabs';
import { TabProps } from './Tab';


export const Tabs: React.ComponentType<TabsProps> = loadable(() => import(/* webpackChunkName: "core.components.tabs" */'./Tabs'));
export const Tab: React.ComponentType<TabProps> = loadable(() => import(/* webpackChunkName: "core.components.tabs" */'./Tab'));

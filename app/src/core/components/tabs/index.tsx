import React from 'react';
import { TabsProps } from './Tabs';
import { TabProps } from './Tab';
import { loader } from 'components/loader';

export const Tabs:loader.Class<TabsProps> = loader(() => import(/* webpackChunkName: "core.components.tabs" */'./Tabs'));
export const Tab:loader.Class<TabProps> = loader(() => import(/* webpackChunkName: "core.components.tabs" */'./Tab'));

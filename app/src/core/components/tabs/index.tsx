import React from 'react';
import { TabsProps } from './Tabs';
import { TabProps } from './Tab';
import { loader } from 'components/loader';

export const Tabs = loader<TabsProps>(() => import(/* webpackChunkName: "core.components.tabs" */'./Tabs'));
export const Tab  = loader<TabProps>(() => import(/* webpackChunkName: "core.components.tabs" */'./Tab'));

import React from 'react';
import loadable from '@loadable/component';
import { ScrollbarProps } from './Scrollbar';


export const Scrollbar: React.ComponentType<ScrollbarProps> = loadable(() => import(/* webpackChunkName: "core.components.scrollbar" */'./Scrollbar'));

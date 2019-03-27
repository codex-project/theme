import React from 'react';
import { ScrollbarProps } from './Scrollbar';
import { loader } from 'components/loader';


export const Scrollbar:loader.Class<ScrollbarProps> = loader(() => import(/* webpackChunkName: "core.components.scrollbar" */'./Scrollbar'));

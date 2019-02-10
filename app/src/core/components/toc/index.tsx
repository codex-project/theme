import React from 'react';
import loadable from '@loadable/component';
import { TOCProps } from './TOC';
import { TOCListProps } from './TOCList';
import { TOCListItemProps } from './TOCListItem';
import { TOCHeaderProps } from './TOCHeader';


export const TOC: React.ComponentType<TOCProps>                 = loadable(() => import(/* webpackChunkName: "core.components.toc" */'./TOC'));
export const TOCList: React.ComponentType<TOCListProps>         = loadable(() => import(/* webpackChunkName: "core.components.toc" */'./TOCList'));
export const TOCListItem: React.ComponentType<TOCListItemProps> = loadable(() => import(/* webpackChunkName: "core.components.toc" */'./TOCListItem'));
export const TOCHeader: React.ComponentType<TOCHeaderProps>     = loadable(() => import(/* webpackChunkName: "core.components.toc" */'./TOCHeader'));


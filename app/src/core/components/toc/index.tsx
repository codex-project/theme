import React from 'react';
import { TOCProps } from './TOC';
import { TOCListProps } from './TOCList';
import { TOCListItemProps } from './TOCListItem';
import { TOCHeaderProps } from './TOCHeader';
import { loader } from 'components/loader';


export const TOC:loader.Class<TOCProps> = loader(() => import(/* webpackChunkName: "core.components.toc" */'./TOC'));
export const TOCList:loader.Class<TOCListProps> = loader(() => import(/* webpackChunkName: "core.components.toc" */'./TOCList'));
export const TOCListItem:loader.Class<TOCListItemProps> = loader(() => import(/* webpackChunkName: "core.components.toc" */'./TOCListItem'));
export const TOCHeader:loader.Class<TOCHeaderProps> = loader(() => import(/* webpackChunkName: "core.components.toc" */'./TOCHeader'));


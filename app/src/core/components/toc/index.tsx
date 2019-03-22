import React from 'react';
import { TOCProps } from './TOC';
import { TOCListProps } from './TOCList';
import { TOCListItemProps } from './TOCListItem';
import { TOCHeaderProps } from './TOCHeader';
import { loader } from 'components/loader';


export const TOC         = loader<TOCProps>(() => import(/* webpackChunkName: "core.components.toc" */'./TOC'));
export const TOCList     = loader<TOCListProps>(() => import(/* webpackChunkName: "core.components.toc" */'./TOCList'));
export const TOCListItem = loader<TOCListItemProps>(() => import(/* webpackChunkName: "core.components.toc" */'./TOCListItem'));
export const TOCHeader   = loader<TOCHeaderProps>(() => import(/* webpackChunkName: "core.components.toc" */'./TOCHeader'));


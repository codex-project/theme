import React from 'react';
import { componentLoader } from 'utils/componentLoader';
import { TOCList as TOCListClass } from './TOCList';
import { TOCListItem as TOCListItemClass } from './TOCListItem';
import { TOCHeader as TOCHeaderClass } from './TOCHeader';


export const TOCList = componentLoader<typeof TOCListClass>(
    async () => (await import('./TOCList')).TOCList,
    (TOCList, props: any) => <TOCList {...props} />,
    { delay: 1000 },
);


export const TOCListItem = componentLoader<typeof TOCListItemClass>(
    async () => (await import('./TOCListItem')).TOCListItem,
    (TOCListItem, props: any) => <TOCListItem {...props} />,
    { delay: 1000 },
);


export const TOCHeader = componentLoader<typeof TOCHeaderClass>(
    async () => (await import('./TOCHeader')).TOCHeader,
    (TOCHeader, props: any) => <TOCHeader {...props} />,
    { delay: 1000 },
);


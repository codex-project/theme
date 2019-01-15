import React from 'react';
import { componentLoader } from 'utils/componentLoader';


export const TOC = componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "toc" */'./TOC')).TOC,
        style    : async () => await import(/* webpackChunkName: "toc" */'./toc.scss'),
    },
    ({ Component }, props: any) => <Component {...props} />,
    { delay: 1000 },
);

export const TOCList = componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "toc" */'./TOCList')).TOCList,
        style    : async () => await import(/* webpackChunkName: "toc" */'./toc.scss'),
    },
    ({ Component }, props: any) => <Component {...props} />,
    { delay: 1000 },
);

export const TOCListItem = componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "toc" */'./TOCListItem')).TOCListItem,
        style    : async () => await import(/* webpackChunkName: "toc" */'./toc.scss'),
    },
    ({ Component }, props: any) => <Component {...props} />,
    { delay: 1000 },
);

export const TOCHeader = componentLoader(
    {
        Component: async () => (await import(/* webpackChunkName: "toc" */'./TOCHeader')).TOCHeader,
        style    : async () => await import(/* webpackChunkName: "toc" */'./toc.scss'),
    },
    ({ Component }, props: any) => <Component {...props} />,
    { delay: 1000 },
);


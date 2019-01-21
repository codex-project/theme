import React from 'react';
import { componentLoader } from 'utils/componentLoader';
import { Scrollbar as ScrollbarClass, ScrollbarProps } from './Scrollbar';

export const Scrollbar: React.ComponentType<ScrollbarProps> = componentLoader<typeof ScrollbarClass>(
    async () => (await import(/* webpackChunkName: "core.components.scrollbar" */'./Scrollbar')).Scrollbar,
    (Scrollbar: any, props) => <Scrollbar {...props} />,
    { delay: 1000 },
);

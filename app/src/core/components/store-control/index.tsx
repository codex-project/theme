import React from 'react';
import { componentLoader } from 'utils/componentLoader'
import { StoreControl as StoreControlClass, StoreControlProps } from './StoreControl';

export let StoreControl: React.ComponentType<StoreControlProps> = () => null;

if ( DEV ) {
    StoreControl = componentLoader<typeof StoreControlClass>(
        async () => (await import(/* webpackChunkName: "core.components.store-control" */'./StoreControl')).StoreControl,
        (StoreControl: any, props) => <StoreControl {...props} />,
        { delay: 1000 },
    );
}

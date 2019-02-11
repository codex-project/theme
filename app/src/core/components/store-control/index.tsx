import React from 'react';
import { StoreControlProps } from './StoreControl';
import { default as DevDialogClass, DevDialogItemKind, DialogReturn } from './DevDialog';
import loadable from '@loadable/component';
import { Modal } from 'antd';
import { listen } from 'utils/general';

export let StoreControl: React.ComponentType<StoreControlProps> = () => null;
export let DevDialog: typeof DevDialogClass                     = (() => null) as any;

if ( DEV ) {
    StoreControl = loadable(() => import(/* webpackChunkName: "core.components.store-control" */'./StoreControl'));
    DevDialog    = loadable(() => import(/* webpackChunkName: "core.components.store-control" */'./DevDialog')) as any;
}

export const dialog = {
    show     : (...items: DevDialogItemKind[]): DialogReturn => {
        return Modal.info({
            title  : 'DevDialog',
            content: (
                <DevDialog items={items}/>
            ),
        });
    },
    bindToKey: (key: string, ...items: DevDialogItemKind[]):{ remove() } => {
        return listen(window, 'keydown', (event: WindowEventMap['keydown']) => {
            if ( event.key.toLowerCase() !== key.toLowerCase() || event.shiftKey === false ) return;
            dialog.show(...items);
        });
    },
};

// StoreControl = componentLoader<typeof StoreControlClass>(
//     async () => (await import(/* webpackChunkName: "core.components.store-control" */'./StoreControl')),
//     (StoreControl: any, props) => <StoreControl {...props} />,
//     { delay: 1000 },
// );

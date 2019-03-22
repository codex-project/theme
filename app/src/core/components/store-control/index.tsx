import React from 'react';
import { StoreControlProps } from './StoreControl';
import { default as DevDialogClass, DevDialogItemKind, DevDialogProps, DialogReturn } from './DevDialog';
import { Modal } from 'antd';
import { listen } from 'utils/general';
import { loader } from 'components/loader';

export let StoreControl: React.ComponentType<StoreControlProps> = () => null;
export let DevDialog: typeof DevDialogClass                     = (() => null) as any;

if ( DEV ) {
    StoreControl = loader<StoreControlProps>(() => import(/* webpackChunkName: "core.components.store-control" */'./StoreControl'));
    DevDialog    = loader<DevDialogProps>(() => import(/* webpackChunkName: "core.components.store-control" */'./DevDialog')) as any;
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
    bindToKey: (key: string, ...items: DevDialogItemKind[]): { remove() } => {
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

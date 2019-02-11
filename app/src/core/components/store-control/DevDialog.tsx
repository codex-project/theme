import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { camelCase } from 'lodash';
import { Button, ButtonProps } from 'components/button';
import { ModalFuncProps } from 'antd/es/modal/Modal';
import Row from 'antd/es/grid/row';

const log = require('debug')('DevDialog');

export type DevDialogItemType = 'button'

export interface DevDialogItem<T extends DevDialogItemType, P = any> {
    type: T
    as?: any
    props?: P

    [ key: string ]: any
}

export type DevDialogButtonItem = DevDialogItem<'button', ButtonProps>


export type DevDialogItemKind = DevDialogItem<any> | DevDialogButtonItem ;

export interface DevDialogProps {
    items: Array<DevDialogItemKind>
}

export type DialogReturn = {
    destroy: () => void;
    update: (newConfig: ModalFuncProps) => void;
}
@hot(module)

export default class DevDialog extends Component<DevDialogProps> {
    static displayName                           = 'DevDialog';
    static defaultProps: Partial<DevDialogProps> = {};

    render() {
        const { children, items, ...props } = this.props;
        return (
            <Row type="flex">
                {items.map((item, index) => {
                    return <Row key={index} type="flex">{this.renderItem(item)}</Row>;
                })}
                {children}
            </Row>
        );
    }

    renderItem<T extends DevDialogItemType, P>(item: DevDialogItem<T, P>) {
        let methodName = camelCase('render_' + item.type + '_item');
        if ( typeof this[ methodName ] === 'function' ) {
            return this[ methodName ](item);
        }
        console.warn('DevDialog method ', methodName, ' found for type', item);
        return null;
    }

    renderButtonItem(item: DevDialogButtonItem) {
        return (
            <Button {...item.props} />
        );
    }

}

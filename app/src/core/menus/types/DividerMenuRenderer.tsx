///<reference path="../../../modules.d.ts"/>
import { MenuType } from '../MenuType';
import React from 'react';
import { MenuItem } from '@codex/api';
import { Menu } from 'antd';

const { Item, Divider } = Menu;

const name = 'divider-renderer';
const log  = require('debug')('menus:types:' + name);

export class DividerMenuRenderer extends MenuType {
    name = name;


    public test(item: MenuItem, stage): boolean {
        return item.type === 'divider' && [ 'render' ].includes(stage); //stage === 'render' && stage === 'renderInner';
    }

    public render(inner, item: MenuItem, menu) {
        let label = item.label;
        return (
            <Divider key={item.id}>{menu.props.mode === 'horizontal' ? '&nbsp' : null}</Divider>
        );
    }


}

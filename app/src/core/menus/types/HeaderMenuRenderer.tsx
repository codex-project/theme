///<reference path="../../../modules.d.ts"/>
import { MenuType } from '../MenuType';
import React, { Fragment } from 'react';
import { MenuItem } from '@codex/api';
import { MenuItemIcon } from 'components/dynamic-menu/MenuItemIcon';
import { Menu } from 'antd';

const Item = Menu.Item;

const name = 'header-renderer';
const log  = require('debug')('menus:types:' + name);

export class HeaderMenuRenderer extends MenuType {
    name = name;


    public test(item: MenuItem, stage): boolean {
        return item.type === 'header' && [ 'render' ].includes(stage); //stage === 'render' && stage === 'renderInner';
    }

    public render(inner,item: MenuItem) {
        let label = item.label;
        return (
            <Item key={item.id} level={0}><MenuItemIcon item={item} /><span>{item.label}</span></Item>
        );
    }


}

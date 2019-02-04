///<reference path="../../../modules.d.ts"/>
import { MenuType } from '../MenuType';
import React, { Fragment } from 'react';
import { MenuItem } from '@codex/api';
import { MenuItemIcon } from 'components/dynamic-menu/MenuItemIcon';
import { Menu } from 'antd';

const Item = Menu.Item;

const name = 'default-renderer';
const log  = require('debug')('menus:types:' + name);

export class DefaultMenuRenderer extends MenuType {
    name = name;


    public test(item: MenuItem, stage): boolean {
        return item.renderer === 'default' && [ 'renderInner' ].includes(stage); //stage === 'render' && stage === 'renderInner';
    }

    public renderInner(item: MenuItem) {
        let label = item.label;
        return (
            <Fragment>
                <MenuItemIcon item={item}/>
                <span>{label}</span>
            </Fragment>
        );
    }


}

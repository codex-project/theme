///<reference path="../../../modules.d.ts"/>
import { MenuItems } from '../MenuItems';
import { MenuType } from '../MenuType';
import React from 'react';
import { MenuItem } from '@codex/api';

const name = 'custom';
const log  = require('debug')('menus:types:' + name);

export class CustomMenuType extends MenuType {
    name = name;


    public test(item: MenuItem): boolean {
        return item.custom !== undefined;
    }

    public handle(item: MenuItem, event: React.MouseEvent, items: MenuItems) {
        return item.custom(item, event, items);
    }
}

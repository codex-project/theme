import { MenuItem } from '@codex/api';
import { MenuItems, MenuType } from '..';
import { IStoreProxy } from '../../stores/proxy';
import { LayoutStoreSide } from '../../stores/LayoutStore';
import { transaction } from 'mobx';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import React from 'react';

import { DynamicMenu } from '../../components/dynamic-menu/DynamicMenu';
import { Menu } from 'antd';
const Item = Menu.Item;
const name = 'side-menu';
const log  = require('debug')('menus:types:' + name);

export interface SideMenuTypeChildHookContext {
    parent: MenuItem
    side: IStoreProxy<LayoutStoreSide>
    close: Function
}

export class SideMenuType extends MenuType {
    name                  = name;
    public readonly hooks = MenuType.makeHooks({
        child: new SyncHook<MenuItem, SideMenuTypeChildHookContext>([ 'child', 'context' ]),
    });

    public test(item: MenuItem): boolean {
        return item.type === name;
    }

    public handle(item: MenuItem, event: any, items: MenuItems) {
        log('handle', { item, event });
        let side: IStoreProxy<LayoutStoreSide> = this.app.store.layout[ item.side ];
        let { show }                           = side;

        const close = () => {
            side.meta.sideMenuParentItem = undefined;
            side.collapsed               = true;
            item.selected                = false;
        };

        // side is closed, open it
        if ( show === false ) {
            // side.meta.sideMenuParentItem = item.id;
            // side.menu                    = toJS(item.children) as any;
            side.show = true;
            // side.collapsed               = false;
            // item.selected                = true;
        } //else {
        if ( side.meta.sideMenuParentItem !== item.id ) {
            transaction(() => {
                items.items(side.meta.sideMenuParentItem).deselect();
                side.meta.sideMenuParentItem = item.id;
                side.menu                    = (item.children as any).map(child => {
                    child.parent = undefined;
                    this.hooks.child.call(child, { close, parent: item, side });
                    return child;
                });
                item.selected                = true;
                side.collapsed               = false;
            });
            setTimeout(() => side.menu.compile(), 500);
        } else {
            close();
        }
    }

    public render(inner: React.ReactElement<any>, item: MenuItem, menu: DynamicMenu) {
        return <Item key={item.id}>{inner}</Item>
    }




}

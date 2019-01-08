import { MenuItem } from '@codex/api';
import { MenuItems, MenuType } from '../../menus';
import { IStoreProxy } from '../../stores/proxy';
import { LayoutStoreSide } from '../../stores/store.layout';
import { toJS } from 'mobx';

const name = 'side-menu';
const log  = require('debug')('menus:types:' + name);

export class SideMenuType extends MenuType {
    name = name;

    public test(item: MenuItem): boolean {
        return item.type === name;
    }

    public handle(item: MenuItem, event: any, items: MenuItems) {
        log('handle', { item, event });
        let side: IStoreProxy<LayoutStoreSide> = this.app.store.layout[ item.side ];
        let { show }                           = side;

        // side is closed, open it
        if ( show === false ) {
            // side.meta.sideMenuParentItem = item.id;
            // side.menu                    = toJS(item.children) as any;
            side.show = true;
            // side.collapsed               = false;
            // item.selected                = true;
        } //else {
        if ( side.meta.sideMenuParentItem !== item.id ) {
            items.items(side.meta.sideMenuParentItem).deselect();
            side.meta.sideMenuParentItem = item.id;
            side.menu                    = (toJS(item.children) as any).map(child => {
                child.parent = undefined;
                return child;
            });
            item.selected                = true;
            side.collapsed               = false;
        } else {
            side.meta.sideMenuParentItem = undefined;
            side.collapsed               = true;
            item.selected                = false;
        }
        // }
    }
}

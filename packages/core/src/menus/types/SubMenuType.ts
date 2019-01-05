import { MenuItem } from '@codex/api';
import { MenuItems, MenuType } from 'menus';

const name = 'sub-menu';
const log  = require('debug')('menus:types:' + name);

export class SubMenuType extends MenuType {
    name = name;

    public test(item: MenuItem): boolean {
        return item.type === name;
    }

    public handle(item: MenuItem, event: any, items: MenuItems) {
        log('handler sub-menu', { item, event });
        item.expand = ! item.expand;
    }
}

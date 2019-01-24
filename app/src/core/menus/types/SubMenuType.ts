import { MenuItem } from '../MenuItem';
import { IMenuType, IMenuTypeStage, MenuItems, MenuType } from '../../menus';

const name = 'sub-menu';
const log  = require('debug')('menus:types:' + name);

export class SubMenuType extends MenuType implements IMenuType {
    name = name;

    public test(item: MenuItem, stage: IMenuTypeStage): boolean {
        return stage === 'defaults' || item.type === name;
    }

    public defaults(item: MenuItem, parent?: MenuItem): MenuItem {
        if ( item.type === undefined && item.children ) {
            item.type = 'sub-menu';
        }
        return item;
    }

    public handle(item: MenuItem, event: any, items: MenuItems) {
        log('handler sub-menu', { item, event });
        item.expand = ! item.expand;
    }
}

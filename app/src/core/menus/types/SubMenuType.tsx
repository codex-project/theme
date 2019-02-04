import { IMenuType, IMenuTypeStage, MenuItems, MenuType } from '..';
import { MenuItem } from '@codex/api';
import { Menu as AntdMenu } from 'antd';
import React from 'react';
import { DynamicMenu } from '../../components/dynamic-menu/DynamicMenu';

const name = 'sub-menu';
const log  = require('debug')('menus:types:' + name);

const { SubMenu, Item, Divider } = AntdMenu;

export class SubMenuType extends MenuType implements IMenuType {
    name = name;

    public test(item: MenuItem, stage: IMenuTypeStage): boolean {
        return (stage === 'defaults' || item.type === name) || (item.type === name && stage === 'render');
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

    public render(inner: React.ReactElement<any>, item: MenuItem, menu: DynamicMenu) {

        return (
            <SubMenu
                key={item.id}
                title={inner} //<Fragment><MenuItemIcon item={item}/><span>{item.label}</span></Fragment>}
                onTitleClick={menu.onTitleClick}
            >
                {item.children.map(child => menu.renderMenuItem(child))}
            </SubMenu>
        );
    }


}

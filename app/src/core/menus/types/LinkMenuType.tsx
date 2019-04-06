import { MenuItem } from '@codex/api';
import { MenuType } from '../MenuType';
import React from 'react';
import { getRandomId } from 'utils/general';
import { Menu } from 'antd';

const Item = Menu.Item;

export class LinkMenuType extends MenuType {
    name = 'link';

    public test(item: MenuItem, stage): boolean {
        return item.type === 'link'
            || (item.type === 'link' && stage === 'render')
            || (typeof item.href === 'string' && item.href.length > 0);
    }

    public render(inner: React.ReactElement<any>, item: MenuItem) {
        return (
            <Item key={item.id}>
                <a href={item.href} target={item.target} key={getRandomId(6)}>{inner}</a>
            </Item>
        );
    }

    //
    // public pre(item: MenuItem) {
    //     if ( ! item.to && item.path ) {
    //         let matches = this.app.routes.matchPath(item.path);
    //         item.to     = matches[ 0 ] ? matches[ 0 ] : item.path;
    //     }
    //     return item;
    // }
    //
    // public handle(item: MenuItem, event, items: MenuItems) {
    //     event.preventDefault();
    //     if ( item.to ) {
    //         let url = this.app.routes.toUrl(item.to);
    //         if ( item.to.replace ) {
    //             return this.app.history.replace(url);
    //         }
    //         return this.app.history.push(url);
    //     }
    //     console.warn('RouterLinkMenuType handle :: menu ite did not have a [to] property', { item });
    // }

}

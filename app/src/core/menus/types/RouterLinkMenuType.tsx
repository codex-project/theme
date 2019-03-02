import { MenuItem } from '@codex/api';
import { MenuType } from '../MenuType';
import { MenuItems } from '../MenuItems';
import React from 'react';
import { getRandomId } from 'utils/general';
import { RouteLink } from 'router';
import { Menu } from 'antd';

const Item = Menu.Item;

export class RouterLinkMenuType extends MenuType {
    name = 'router-link';

    public test(item: MenuItem, stage): boolean {
        return item.type === 'router-link' || (item.type === 'router-link' && stage === 'render');
    }

    public pre(item: MenuItem) {
        if ( ! item.to && item.path ) {
            let matches = this.app.routes.matchPath(item.path);
            item.to     = matches[ 0 ] ? matches[ 0 ] : item.path;
        }
        return item;
    }

    public handle(item: MenuItem, event, items: MenuItems) {
        event.preventDefault();
        if ( item.to ) {
            let url = this.app.routes.toUrl(item.to);
            if ( item.to.replace ) {
                return this.app.history.replace(url);
            }
            return this.app.history.push(url);
        }
        console.warn('RouterLinkMenuType handle :: menu ite did not have a [to] property', { item });
    }

    public render(inner: React.ReactElement<any>, item: MenuItem) {

        return (
            <Item key={item.id}>
                {/*<RouteLink to={item.to} key={getRandomId(6)}>{inner}</RouteLink>*/}
                <a href={this.app.routes.toUrl(item.to)} key={getRandomId(6)} onClick={e => e.preventDefault()}>{inner}</a>
            </Item>
            //     {
            //         item.type === 'link' ?
            //         <a href={item.href} target={item.target} key={getRandomId(6)}>{inner}</a> :
            //         item.type === 'router-link' ?
            //          :
            //         inner
            //     }
            // </Item>
        );
    }

}

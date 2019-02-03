import * as React from 'react';
import { Fragment } from 'react';
import { MenuItemRenderer, MenuItemRendererProps } from './DynamicMenu';
import { Menu as AntdMenu } from 'antd';
import { MenuItemIcon } from './MenuItemIcon';
import { hot } from 'decorators';
import { getRandomId } from 'utils/general';
import { RouteLink } from 'router';

const { SubMenu, Item } = AntdMenu;

const log = require('debug')('components:DefaultMenuItemRenderer');


@hot(module, true)
@MenuItemRenderer('default')
export class DefaultMenuItemRenderer extends React.Component<MenuItemRendererProps> {
    static displayName = 'DefaultMenuItemRenderer';

    render() {
        if ( ! this.props.item ) return null;
        let { item, color, ...props } = this.props;
        let label                     = item.label;
        const content                 = (
            <Fragment>
                <MenuItemIcon item={item}/>
                <span>{label}</span>
            </Fragment>
        );
        return (
            <Item key={item.id} {...props}>
                {
                    item.type === 'link' ?
                    <a href={item.href} target={item.target} key={getRandomId(6)}>{content}</a> :
                    item.type === 'router-link' ?
                    <RouteLink to={item.to} key={getRandomId(6)}>{content}</RouteLink> :
                    content
                }
            </Item>
        );
    }
}

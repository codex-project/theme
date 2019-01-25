import * as React from 'react';
import { MenuItemRenderer, MenuItemRendererProps } from './DynamicMenu';
import { Menu as AntdMenu } from 'antd';
import { MenuItemIcon } from './MenuItemIcon';
import { hot } from 'decorators';

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

        return (
            <Item key={item.id} {...props}>
                <MenuItemIcon item={item}/>
                <span>{label}</span>
            </Item>
        );
    }
}

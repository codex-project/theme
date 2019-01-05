import * as React from 'react';
import { hot } from '../../decorators';
import { MenuItemRenderer, MenuItemRendererProps } from './DynamicMenu';
import { Menu as AntdMenu } from 'antd';
import { MenuItemIcon } from './MenuItemIcon';

const { SubMenu, Item } = AntdMenu;

const log = require('debug')('components:DefaultMenuItemRenderer');


@hot(module,true)
@MenuItemRenderer('default')
export class DefaultMenuItemRenderer extends React.Component<MenuItemRendererProps> {
    static displayName = 'DefaultMenuItemRenderer';

    render() {
        if ( ! this.props.item ) return null;
        let { item, fontSize, iconStyle, color,...props } = this.props;
        let label                                = item.label;

        return (
            <Item key={item.id} {...props}>
                <span style={{ fontSize, paddingRight: iconStyle.paddingRight }}>
                    <MenuItemIcon item={item} iconStyle={iconStyle} fontSize={fontSize}/>
                    {label}
                </span>
            </Item>
        );
    }
}

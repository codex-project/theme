import * as React from 'react';
import { hot } from '../../decorators';
import { MenuItemRenderer, MenuItemRendererProps } from './DynamicMenu';
import { Col, Menu as AntdMenu, Row } from 'antd';
import { getRandomId } from '../../utils/general';
// noinspection ES6UnusedImports
import styles from './HeaderMenuItemRenderer.mscss';
import './HeaderMenuItemRenderer.mscss';
import { MenuItemIcon } from './MenuItemIcon';
import { NavLink } from 'react-router-dom';

const { SubMenu, Item } = AntdMenu;

const log = require('debug')('components:HeaderMenuItemRenderer');


@hot(module,true)
@MenuItemRenderer('header')
export class HeaderMenuItemRenderer extends React.Component<MenuItemRendererProps> {
    static displayName = 'HeaderMenuItemRenderer';

    render() {
        if ( ! this.props.item ) return null;
        let { item, fontSize, iconStyle, color,items,rendererMaxLevel,renderer, ...props } = this.props;
        const { icon, sublabel, label }                    = item;
        const content                                      = (
            <Row type="flex" justify="start" key={getRandomId(6)}>
                {icon ? <Col order={1} styleName="icon-col"> <MenuItemIcon styleName="icon" item={item} /> </Col> : null}
                <Col order={2} styleName="icon-col">
                    <Row styleName="label">{label}</Row>
                    <Row styleName="sublabel">{sublabel}</Row>
                </Col>
            </Row>
        );
        return (
            <Item key={item.id} {...props} styleName="header-menu-item" >
                {
                    item.type === 'link' ?
                    <a href={item.href} target={item.target} key={getRandomId(6)}>{content}</a> :
                    item.type === 'router-link' ?
                    <NavLink to={item.to} key={getRandomId(6)}>{content}</NavLink> :
                    content
                }
            </Item>
        );
    }
}

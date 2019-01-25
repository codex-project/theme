import * as React from 'react';
import { MenuItemRenderer, MenuItemRendererProps } from './DynamicMenu';
import { Col, Menu as AntdMenu, Row } from 'antd';
// noinspection ES6UnusedImports
import styles from './BigMenuItemRenderer.mscss';
import './BigMenuItemRenderer.mscss';
import { MenuItemIcon } from './MenuItemIcon';
import { getRandomId } from 'utils/general';
import { hot } from 'decorators';
import { RouteLink } from 'router';

const { SubMenu, Item } = AntdMenu;

const log = require('debug')('components:HeaderMenuItemRenderer');


@hot(module,true)
@MenuItemRenderer('big')
export class BigMenuItemRenderer extends React.Component<MenuItemRendererProps> {
    static displayName = 'BigMenuItemRenderer';

    render() {
        if ( ! this.props.item ) return null;
        let { item, color,items,renderer, ...props } = this.props;
        const { icon, sublabel, label }                    = item;
        const content                                      = (
            <Row type="flex" justify="start" key={getRandomId(6)}>
                {icon ? <Col order={1} styleName="icon-col"> <MenuItemIcon styleName="icon" item={item} /> </Col> : null}
                <Col order={2} styleName="label-col" >
                    <Row styleName="label">{label}</Row>
                    <Row styleName="sublabel">{sublabel}</Row>
                </Col>
            </Row>
        );
        return (
            <Item key={item.id} {...props} styleName="big-menu-item" >
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

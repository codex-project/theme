///<reference path="../../../modules.d.ts"/>
import { MenuType } from '../MenuType';
import React, { Fragment } from 'react';
import { MenuItem } from '@codex/api';
import { MenuItemIcon } from 'components/dynamic-menu/MenuItemIcon';
import { Col, Menu, Row } from 'antd';
import { getRandomId } from 'utils/general';

import styles from './BigMenuRenderer.mscss'
// import './BigMenuRenderer.mscss'
import { DynamicMenu } from '../../components/dynamic-menu/DynamicMenu';
const Item = Menu.Item;

const name = 'big-renderer';
const log  = require('debug')('menus:types:' + name);

export class BigMenuRenderer extends MenuType {
    name = name;


    public test(item: MenuItem, stage): boolean {
        return item.renderer === 'big' && [ 'renderInner','rendered' ].includes(stage); //stage === 'render' && stage === 'renderInner';
    }

    public renderInner(item: MenuItem) {
        const { icon, sublabel, label }                    = item;
        return (
            <Row type="flex" justify="start" key={getRandomId(6)} styleName="big-menu-item">
                {icon ? <Col order={1} styleName="icon-col"> <MenuItemIcon styleName="icon" item={item} /> </Col> : null}
                <Col order={2} styleName="label-col" >
                    <Row styleName="label">{label}</Row>
                    <Row styleName="sublabel">{sublabel}</Row>
                </Col>
            </Row>
        );
    }

    public rendered(element: React.ReactElement<any>, item: MenuItem, menu: DynamicMenu) {
        return React.cloneElement(element, {className: styles['big-menu-item']})
    }


}

///<reference path="../../../modules.d.ts"/>
import { MenuType } from '../MenuType';
import React from 'react';
import { MenuItem } from '@codex/api';
import { MenuItemIcon } from 'components/dynamic-menu/MenuItemIcon';
import { Col, Row } from 'antd';
import { getRandomId } from 'utils/general';


const name = 'big-renderer';
const log  = require('debug')('menus:types:' + name);

export class BigMenuRenderer extends MenuType {
    name = name;


    public test(item: MenuItem, stage): boolean {
        return item.renderer === 'big' && [ 'renderInner' ].includes(stage); //stage === 'render' && stage === 'renderInner';
    }

    public renderInner(item: MenuItem) {
        const { icon, sublabel, label } = item;
        return (
            <Row type="flex" justify="start" key={getRandomId(6)}>
                {icon ? <Col order={1} className="icon-col"> <MenuItemIcon className="icon" item={item}/> </Col> : null}
                <Col order={2} className="label-col">
                    <Row className="label">{label}</Row>
                    <Row className="sublabel">{sublabel}</Row>
                </Col>
            </Row>
        );
    }


}

import React from 'react';
import { DynamicMenu, Hot, RouteLink, scrollTo } from 'codex_core';
import { Col, Menu, Row } from 'antd';
import classNames from 'classnames';
import styled from 'styled-components';

const log                = require('debug')('views:home')

//region:Styled Components
const { Item: BaseItem } = Menu;
const { Icon: BaseIcon } = DynamicMenu
const Item                 = styled(BaseItem)`
height: auto !important;
&:hover{
    background-color: cadetblue;
}`
const ItemRow: typeof Row  = styled(Row as any).attrs({ type: 'flex', justify: 'start' })`` as any;
const IconCol: typeof Col  = styled(Col as any).attrs({ order: 1 })`
width: 50px;` as any;
const Icon                 = styled(BaseIcon)`
font-size: 30px;
margin: 18px auto 0;` as any;
const LabelCol: typeof Col = styled(Col as any).attrs({ order: 2 })`
//white-space: normal;
width: calc(100% - 50px)` as any;
const Label: typeof Row    = styled(Row as any)`
font-weight: bold;
padding: 0;
height: 50%;` as any;
const SubLabel: typeof Row = styled(Row as any)`
font-size: 10px;
line-height: 15px;` as any;
//endregion

export interface WelcomeMenuItemProps {
    id: string,
    label: string,
    sublabel?: string,
    icon?: string,
    link?: string,
    params?: any,
    scrollTarget?: string
    className?: any
}

@Hot(module)
export class WelcomeMenuItem extends React.Component<WelcomeMenuItemProps> {
    static Item: typeof Item         = Item;
    static ItemRow: typeof ItemRow   = ItemRow;
    static Icon: typeof Icon         = Icon;
    static IconCol: typeof IconCol   = IconCol;
    static Label: typeof Label       = Label;
    static LabelCol: typeof LabelCol = LabelCol;
    static SubLabel: typeof SubLabel = SubLabel;

    render() {
        const { icon, className, children, id, sublabel, label, link, scrollTarget, params, ...rest } = this.props
        const row                                                                                     = (
            <ItemRow>
                {icon ? <IconCol><Icon item={{ icon }}/></IconCol> : null}
                <LabelCol>
                    <Label>{label}</Label>
                    {sublabel ? <SubLabel>{sublabel}</SubLabel> : null}
                </LabelCol>
            </ItemRow>
        )

        return (
            <Item id={`menuitem-${id}`} {...rest} key={`menuitem-${id}`} className={classNames(className)}>
                {link ? <RouteLink to={{ name: link, params }}>{row}</RouteLink> : null}
                {scrollTarget ? <a onClick={e => scrollTo(scrollTarget)}>{row}</a> : null}
            </Item>
        )
    }
}

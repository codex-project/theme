import React, { HTMLAttributes } from 'react';
import { Col, Input, Popover, Row, Tabs, Tooltip } from 'antd';
import { PhpdocType } from './type';
import { TooltipProps } from 'antd/es/tooltip';
import { PopoverProps } from 'antd/es/popover';
import { Member } from './member-list/list';

const TabPane = Tabs.TabPane;
const Search  = Input.Search;

const log = require('debug')('phpdoc:components:tooltips');


export function iconTooltipStatic(props: TooltipProps = {}, iconProps: HTMLAttributes<any> = {}) {
    return (
        <Tooltip title="Static" overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip" {...props}>
            <i className="phpdoc-modifier-static" {...iconProps}/>
        </Tooltip>
    );
}

export function iconTooltipGotoSource(props: TooltipProps = {}, iconProps: HTMLAttributes<any> = {}) {
    return (
        <Tooltip title="Goto source" overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip" {...props}>
            <i className="fa fa-eye" {...iconProps}/>
        </Tooltip>
    );
}

export function iconTooltipInherited(item: Member, props: PopoverProps = {}, iconProps: HTMLAttributes<any> = {}) {
    if ( ! item.inherited_from ) return null;
    return (
        <Popover
            content={<div>Inherited From:<br/> <PhpdocType type={item.inherited_from} showNamespace={true}/></div>}
            overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip"
            {...props}
        >
            <i className="phpdoc-modifier-inherited" {...iconProps}/>
        </Popover>
    );
}

export function iconTooltipDeprecated(item: Member, props: PopoverProps = {}, iconProps: HTMLAttributes<any> = {}) {
    if ( ! item.docblock.tags.has('deprecated') ) return null;
    return (
        <Popover
            overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip"
            content={
                <Row type="flex">
                    <Col className="fs-25 pl-sm pr-lg"><i className="phpdoc-modifier-deprecated"/></Col>
                    <Col>
                        <div className="red-8 text-bold">Deprecated</div>
                        <div className="grey-2">{item.docblock.tags.get('deprecated').description || ''}</div>
                    </Col>
                </Row>
            }
            {...props}
        >
            <i className="phpdoc-modifier-deprecated" {...iconProps}/>
        </Popover>
    );
}

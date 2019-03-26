import React, { PureComponent } from 'react';
import { iconTooltipDeprecated, iconTooltipGotoSource, iconTooltipStatic } from '../tooltips';
import { Popover, Tooltip } from 'antd';
import { classes } from 'typestyle';
import { isMethod, PhpdocMember, PhpdocMethod } from '../../logic';
import { PhpdocType } from '../type';
import { PopoverProps } from 'antd/es/popover';

const log = require('debug')('components:ListItem');

export interface ListItemProps {
    style?: React.CSSProperties
    className?: string
    item: PhpdocMember
    innerRef?: any
    selected?: boolean
    modifiers?: boolean | React.ReactNode
    extras?: React.ReactNode

    onClick?: (item: PhpdocMember) => any
    onInheritedClick?: (item: PhpdocMember) => any
    onGotoSourceClick?: (item: PhpdocMember) => any
    gotoSource?: boolean
    clickableInherits?: boolean

}

const basePopoverProps: PopoverProps = {
    overlayClassName: 'phpdoc-tooltip phpdoc-member-list-tooltip',
};

export class ListItem extends PureComponent<ListItemProps> {
    static displayName: string                  = 'ListItem';
    static defaultProps: Partial<ListItemProps> = {
        onClick          : () => null,
        onGotoSourceClick: () => null,
        onInheritedClick : () => null,
    };

    render() {
        const { innerRef, onClick, modifiers, extras, className, style, children, selected } = this.props;
        let item                                                                             = this.props.item as PhpdocMethod;
        return (
            <div
                key="list-item"
                ref={innerRef}
                className={classes('phpdoc-member-list-item', `phpdoc-member-list-item-${item.type}`, selected ? 'active' : null, className)}
                style={style}
            >
                <div
                    className="list-item-link"
                    onClick={() => {
                        log('onClick', item);
                        onClick(item);
                    }}>
                    {children}
                </div>
                {extras}
                <If condition={modifiers}>
                    {this.renderModifiers()}
                </If>
            </div>
        );
    }

    renderModifiers() {
        let item = this.props.item as PhpdocMethod;
        return (
            <React.Fragment>
                {this.renderModifierDeprecated(item)}
                {this.renderModifierInherited(item)}
                {this.renderModifierStatic(item)}
                <If condition={isMethod(item)}>
                    {item.abstract ? <a className="list-col-auto no-click modifier"><Tooltip title="Abstract" overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip"><i className="phpdoc-modifier-abstract"/></Tooltip></a> : null}
                    {item.final ? <a className="list-col-auto no-click modifier"><Tooltip title="Final" overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip"><i className="phpdoc-modifier-final"/></Tooltip></a> : null}
                </If>
                {this.renderModifierGotoSource(item)}
            </React.Fragment>
        );
    }


    renderModifierStatic(item: PhpdocMember) {
        if ( ! item.static ) return null;
        return <a className="list-col-auto no-click modifier">{iconTooltipStatic({ placement: 'top' })}</a>;
    }

    renderModifierGotoSource(item: PhpdocMember) {
        if ( ! this.props.gotoSource || item.inherited_from ) return;
        return <a className="list-col-auto modifier" onClick={() => this.props.onGotoSourceClick(item)}>{iconTooltipGotoSource({ placement: 'left' })}</a>;
    }

    renderModifierInherited(item: PhpdocMember) {
        if ( ! item.inherited_from ) return null;
        return (
            <Popover
                {...basePopoverProps}
                content={<div>Inherited From:<br/> <PhpdocType type={item.inherited_from} showNamespace={true} showTooltip={false}/></div>}
                align={{
                    points: [ 'cr', 'cl' ],
                }}
            >
                <a className={'modifier' + (this.props.clickableInherits ? '' : ' no-click')}
                   onClick={() => this.props.clickableInherits ? this.props.onInheritedClick(item) : null}
                >
                    <i className="phpdoc-modifier-inherited"/>
                </a>
            </Popover>
        );
    }

    renderModifierDeprecated(item: PhpdocMember) {
        if ( ! item.docblock.tags.has('deprecated') ) return null;
        return <a className="list-col-auto no-click modifier">{iconTooltipDeprecated(item, { placement: 'left' })}</a>;
    }
}



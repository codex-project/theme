import React, { Component } from 'react';
import { Member } from './list';
import { iconTooltipDeprecated, iconTooltipGotoSource, iconTooltipInherited, iconTooltipStatic } from '../tooltips';
import { Tooltip } from 'antd';
import { classes } from 'typestyle';
import { PhpdocMethod } from '../../logic';
import { hot } from 'react-hot-loader';

const log = require('debug')('components:ListItem');

export interface ListItemProps {
    style?: React.CSSProperties
    className?: string
    item: Member
    innerRef?: any
    selected?: boolean
    modifiers?: boolean | React.ReactNode
    extras?: React.ReactNode

    onClick?: (item: Member) => any
    onInheritedClick?: (item: Member) => any
    onGotoSourceClick?: (item: Member) => any
    gotoSource?: boolean
    clickableInherits?: boolean

}

@hot(module)
export default class ListItem extends Component<ListItemProps> {
    static displayName: string                  = 'ListItem';
    static defaultProps: Partial<ListItemProps> = {
        onClick          : () => null,
        onGotoSourceClick: () => null,
        onInheritedClick : () => null,
    };

    render() {
        const { innerRef, onClick, extras, className, style, children, selected } = this.props;
        let item                                                                  = this.props.item as PhpdocMethod;
        return (
            <li key="list-item" ref={innerRef} className={classes(selected ? 'active' : null, className)} style={style}>
                <div
                    className="list-item-link"
                    onClick={() => {
                        log('onClick', item);
                        onClick(item);
                    }}>
                    {children}
                </div>
                {this.renderModifiers()}
                {extras}
            </li>
        );
    }

    renderModifiers() {
        let item = this.props.item as PhpdocMethod;
        if ( this.props.modifiers === false ) {
            return null;
        }
        if ( this.props.modifiers === undefined ) {
            return (
                <React.Fragment>
                    {this.renderModifierDeprecated(item)}
                    {this.renderModifierInherited(item)}
                    {this.renderModifierStatic(item)}
                    {item.abstract ? <a className="list-col-auto no-click modifier"><Tooltip title="Abstract" overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip"><i className="phpdoc-modifier-abstract"/></Tooltip></a> : null}
                    {item.final ? <a className="list-col-auto no-click modifier"><Tooltip title="Final" overlayClassName="phpdoc-tooltip phpdoc-member-list-tooltip"><i className="phpdoc-modifier-final"/></Tooltip></a> : null}
                    {this.renderModifierGotoSource(item)}
                </React.Fragment>
            );
        }
        return this.props.modifiers;
    }


    renderModifierStatic(item: Member) {
        if ( ! item.static ) return null;
        return <a className="list-col-auto no-click modifier">{iconTooltipStatic()}</a>;
    }

    renderModifierGotoSource(item: Member) {
        if ( ! this.props.gotoSource || item.inherited_from ) return;
        return <a className="list-col-auto modifier" onClick={() => this.props.onGotoSourceClick(item)}>{iconTooltipGotoSource()}</a>;
    }

    renderModifierInherited(item: Member) {
        if ( ! item.inherited_from ) return null;
        let props: any = {
            className: 'list-col-auto modifier ' + (this.props.clickableInherits ? '' : 'no-click'),
            onClick  : () => this.props.clickableInherits ? this.props.onInheritedClick(item) : null,
        };
        return <a {...props}>{iconTooltipInherited(item)}</a>;
    }

    renderModifierDeprecated(item: Member) {
        if ( ! item.docblock.tags.has('deprecated') ) return null;
        return <a className="list-col-auto no-click modifier">{iconTooltipDeprecated(item)}</a>;
    }
}



import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { classes } from 'typestyle';
import { Popover } from 'antd';
import { FQNS, Type } from '../../logic';
import {  PhpdocStore } from '../../logic';
import { isArray, isString } from 'lodash';
import { hot, lazyInject, strStripLeft, strStripRight } from '@codex/core';
import { PhpdocContent } from '../PhpdocContent';
import { Link } from 'react-router-dom';
import './type.scss';

const log = require('debug')('components:PhpdocType');

export interface PhpdocTypeProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;
    seperator?: string;
    noClick?: boolean
    noLink?: boolean
    type: string | string[]
    showNamespace?: boolean
    showTooltip?: boolean
    showTooltipIcon?: boolean
    showTooltipClick?: boolean
    linkToApi?: boolean
    onClick?: () => void
}


@observer
export class PhpdocType extends React.Component<PhpdocTypeProps> {
    static displayName: string                    = 'PhpdocType';
    static defaultProps: Partial<PhpdocTypeProps> = {
        seperator       : ' | ',
        showTooltip     : true,
        showTooltipIcon : true,
        showTooltipClick: true,
        linkToApi       : false,
    };

    static contextType            = PhpdocContent.Context;
    context!: React.ContextType<typeof PhpdocContent.Context>;

    @lazyInject('store.phpdoc') store: PhpdocStore;

    style: { cursor?: string } = {};

    componentDidMount() {
        if ( this.props.noClick ) {
            this.style.cursor = 'default !important';
        } else {
            this.style.cursor = 'pointer !important';
        }
    }

    parseType(type): Type[] {
        if ( isString(type) ) {
            type = type.split('|')
        }
        if ( isArray(type) ) {
            type = type.filter(name => name.length > 1);
            let newType = [];
            type.forEach((t: string) => {
                if ( ! t.startsWith('array') ) {
                    newType.push(t);
                    return;
                }
                strStripLeft(t, 'array<');
                strStripRight(t, '>');
                newType = newType.concat(t.split(','));
            });

            type = newType.map(t => new Type(this.context.manifest, t.toString()));
        }

        return type;
    }

    render() {
        const { noClick, seperator, linkToApi, onClick, children, className, style } = this.props;
        const { showNamespace, showTooltip }                                         = this.props;
        const { project, revision }                                                  = this.context.manifest;
        const types                                                                  = this.parseType(this.props.type);
        const content                                                                = types.map((type, numType) => {
            let line,
                clickable    = noClick !== true || type.isLocal,
                lineChildren = children ? children : showNamespace ? type.entityName : type.fqns.name,
                lineProps    = {
                    style    : {
                        cursor: clickable ? 'pointer' : 'default',
                        ...style,
                    },
                    className: classes(type.cssClass, className),
                    key      : numType,
                    onClick  : onClick ? () => onClick() : clickable && this.store.typeClickHandler ? () => this.store.typeClickHandler(type) : null,
                };

            if ( ! clickable ) {
                line = <span {...lineProps}>{lineChildren}</span>;
            } else if ( linkToApi ) {
                line = <Link to={{ name: 'phpdoc', params: { project, revision }, hash: type.toQuery().toHash() }} {...lineProps}>{lineChildren}</Link>;
            } else {
                line = <a {...lineProps}>{lineChildren}</a>;
            }

            return (
                <Fragment key={numType}>
                    {type.isLocal && showTooltip ?
                     <Popover
                         key={numType + 'popover'}
                         content={this.renderTooltipContent(type)}
                         overlayClassName="phpdoc-tooltip"
                     >
                         {line}
                     </Popover> :
                     line}
                    {numType < types.length - 1 ? <span key={numType + 'seperator'} className="type-seperator">{seperator}</span> : null}
                </Fragment>
            );
        });
        return <Fragment>{content}</Fragment>;

    }

    renderTooltipContent(type: Type) {
        const { showTooltipIcon, showTooltipClick } = this.props;
        return (
            <Fragment>
                <span className={classes(type.cssClass)} key="1">
                    {showTooltipIcon && type.isEntity && type.isLocal ? <i className={classes(type.cssClass, 'mr-xs')}/> : null}
                    {type.entityName}
                </span>
                {showTooltipClick ? <span key="2" className="phpdoc-tooltip-footer">Click to open</span> : null}
            </Fragment>
        );
    }

}

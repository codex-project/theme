import React, { Fragment } from 'react';
import { classes } from 'typestyle';
import { Popover } from 'antd';
import { PhpdocStore, Type } from '../../logic';
import { isArray, isString } from 'lodash';
import { lazyInject, strStripLeft, strStripRight } from '@codex/core';
import { Link } from 'react-router-dom';
import './type.scss';
import { ManifestCtx } from '../base';
import { hot } from 'react-hot-loader';

const log = require('debug')('components:PhpdocType');

export interface PhpdocTypeProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;
    seperator?: string;
    noClick?: boolean
    noLink?: boolean
    showNamespace?: boolean
    showTooltip?: boolean
    showTooltipIcon?: boolean
    showTooltipClick?: boolean
    linkToApi?: boolean
    type: string | string[]
    onClick?: () => void
}

// export { PhpdocType };
// @observer
export default class PhpdocType extends React.PureComponent<PhpdocTypeProps> {
    static displayName: string                    = 'PhpdocType';
    static defaultProps: Partial<PhpdocTypeProps> = {
        seperator       : ' | ',
        // showTooltip     : true,
        // showTooltipIcon : true,
        // showTooltipClick: true,
        // linkToApi       : false,
    };

    static contextType = ManifestCtx;
    context!: React.ContextType<typeof ManifestCtx>;

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
            type = type.split('|');
        }
        if ( isArray(type) ) {
            type        = type.filter(name => name.length > 1);
            let newType = [];
            type.forEach((t: string) => {
                if ( ! t.startsWith('array') ) {
                    newType.push(t);
                    return;
                }
                t       = strStripLeft(t, 'array<');
                t       = strStripRight(t, '>');
                newType = newType.concat(t.split(',').map(t => t + '[]'));
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
                lineChildren = children ? children : showNamespace ? type.entityName : type.fqsen.name,
                suffix       = '',
                lineProps    = {
                    style    : {
                        cursor: clickable ? 'pointer' : 'default',
                        ...style,
                    },
                    className: classes(type.cssClass, className),
                    key      : numType,
                    onClick  : onClick ? () => onClick() : clickable && this.store.typeClickHandler ? () => this.store.typeClickHandler(type) : null,
                };
            if ( type.isArray ) {
                suffix = '[]';
            }

            if ( ! clickable ) {
                line = <span {...lineProps}>{lineChildren}{suffix}</span>;
            } else if ( linkToApi ) {
                line = <Link to={{ name: 'phpdoc', params: { project, revision }, hash: type.toQuery().toHash() }} {...lineProps}>{lineChildren}{suffix}</Link>;
            } else {
                line = <a {...lineProps}>{lineChildren}{suffix}</a>;
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



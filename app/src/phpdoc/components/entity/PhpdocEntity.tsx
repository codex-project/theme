import React from 'react';
import { classes } from 'typestyle';
import { Type } from '../../logic';
import { PhpdocType } from '../type';
import { PhpdocComponent, PhpdocComponentProps } from '../PhpdocComponent';
import { observer } from 'mobx-react';
import { isString } from 'lodash';
import { hot, strEnsureLeft } from '@codex/core';
import './entity.scss';

const log = require('debug')('components:PhpdocHeader');

export interface PhpdocEntityProps extends PhpdocComponentProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional CSSProperties with nesting support (using typestyle) */
    titleStyle?: React.CSSProperties
    /** Optional className */
    className?: string;

    size?: string | number | { class?: string | number, text?: string | number }
}


/**
 * PhpdocHeader component
 */
@hot(module)
@observer
export class PhpdocEntity extends PhpdocComponent<PhpdocEntityProps> {
    static displayName: string                      = 'PhpdocEntity';
    static defaultProps: Partial<PhpdocEntityProps> = {};

    render() {
        let file                                   = this.file;
        let { size, style, className, titleStyle } = this.props;
        // const classNames                           = (...names: string[]) => classes(...names.filter(Boolean).map(name => strEnsureLeft(name, prefixCls + '-')));
        if ( isString(size) ) {}
        return this.renderWithLoader(() =>
            <header style={style} className={classes('phpdoc-entity', className)}>
                <h3 style={titleStyle} className="header-title">
                    <i className={'mr-xs phpdoc-type-' + file.type}/>
                    <span className={'phpdoc-type-' + file.type}>{Type.stripStartSlash(file.entity.full_name)}</span>
                    <If condition={file.entity.extends}>
                        <small className="pl-xs fs-13">extends</small>
                        <PhpdocType className="pl-xs" type={file.entity.extends}/>
                    </If>
                    <If condition={file.isClass && file.class.implements.length > 0}>
                        <small className="pl-xs fs-13">implements</small>
                        <PhpdocType className="pl-xs" type={file.class.implements}/>
                    </If>
                </h3>
            </header>,
        );
    }
}

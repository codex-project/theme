import React from 'react';
import { classes } from 'typestyle';
import { PhpdocType } from '../type';
import { observer } from 'mobx-react';
import { hot } from '@codex/core';
import './entity.scss';
import { PhpdocFileProvider, PhpdocFileProviderProps, withPhpdocFile } from '../providers';
import { FQNSComponent, FQNSComponentCtx } from '../base';

const log = require('debug')('components:PhpdocHeader');


export interface PhpdocEntityBaseProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional CSSProperties with nesting support (using typestyle) */
    titleStyle?: React.CSSProperties
    /** Optional className */
    className?: string;
    prefixCls?: string

    size?: { class?: string | number, text?: string | number } & string & number
}

export interface PhpdocEntityProps extends PhpdocEntityBaseProps, PhpdocFileProviderProps {}

export { PhpdocEntity };

@hot(module)
@FQNSComponent()
@observer
export default class PhpdocEntity extends React.Component<PhpdocEntityProps> {
    static displayName: string                      = 'PhpdocEntity';
    static defaultProps: Partial<PhpdocEntityProps> = {
        prefixCls: 'phpdoc-entity',
    };
    static contextType                              = FQNSComponentCtx;
    context!: React.ContextType<typeof FQNSComponentCtx>;

    render() {
        let { fqns, size, style, className, titleStyle, prefixCls } = this.props;
        let { file }                                                = this.context;
        let classSize                                               = size ? size.class ? size.class : size : 14;
        let textSize                                                = size ? size.class ? size.class : size : 14;

        return (
            <header style={style} className={classes(prefixCls, className)}>
                <h3 style={titleStyle} className="header-title">
                    <i className={'mr-xs phpdoc-type-' + file.type}/>
                    <span className={'phpdoc-type-' + file.type} style={{ fontSize: classSize }}>{file.fqns.entityName}</span>
                    <If condition={file.entity.extends}>
                        <small className="pl-xs" style={{ fontSize: textSize }}>extends</small>
                        <PhpdocType className="pl-xs" style={{ fontSize: classSize }} type={file.entity.extends}/>
                    </If>
                    <If condition={file.isClass && file.class.implements.length > 0}>
                        <small className="pl-xs" style={{ fontSize: textSize }}>implements</small>
                        <PhpdocType className="pl-xs" style={{ fontSize: classSize }} type={file.class.implements}/>
                    </If>
                </h3>
            </header>

        );
    }
}

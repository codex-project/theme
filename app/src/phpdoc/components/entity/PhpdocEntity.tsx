import React from 'react';
import { classes } from 'typestyle';
import { PhpdocType } from '../type';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import './entity.scss';
import { FQSENComponent, FQSENComponentContext } from '../base';
import { IFQSEN } from '../../logic';

const log = require('debug')('components:PhpdocHeader');

export type PhpdocEntityHideType = 'icon' | 'extends' | 'implements'

export interface PhpdocEntityProps {
    fqsen: IFQSEN
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional CSSProperties with nesting support (using typestyle) */
    titleStyle?: React.CSSProperties
    /** Optional className */
    className?: string;
    prefixCls?: string

    size?: { class?: string | number, text?: string | number } & string & number
    innerRef?: (ref: HTMLElement) => any


    noClick?: boolean
    noLink?: boolean
    showNamespace?: boolean
    showTooltip?: boolean
    showTooltipIcon?: boolean
    showTooltipClick?: boolean
    linkToApi?: boolean

    hide?: Array<'icon' | 'extends' | 'implements'>
}


@hot(module)
@FQSENComponent()
@observer
export default class PhpdocEntity extends React.Component<PhpdocEntityProps> {
    static displayName: string                      = 'PhpdocEntity';
    static defaultProps: Partial<PhpdocEntityProps> = {
        prefixCls: 'phpdoc-entity',
        innerRef : (ref: HTMLElement) => ref,
        hide     : [],
    };
    static contextType                              = FQSENComponentContext;
    context!: React.ContextType<typeof FQSENComponentContext>;

    setInnerRef = ref => this.props.innerRef(ref);

    render() {
        let { fqsen, size, style, className, titleStyle, prefixCls, innerRef, showNamespace } = this.props;
        let { file }                                                                          = this.context;
        let classSize                                                                         = size ? size.class ? size.class : size : 14;
        let textSize                                                                          = size ? size.class ? size.class : size : 14;
        let typeProps                                                                         = {
            noClick         : this.props.noClick,
            noLink          : this.props.noLink,
            showNamespace   : this.props.showNamespace,
            showTooltip     : this.props.showTooltip,
            showTooltipIcon : this.props.showTooltipIcon,
            showTooltipClick: this.props.showTooltipClick,
            linkToApi       : this.props.linkToApi,
        };
        let hide: Partial<Record<PhpdocEntityHideType, boolean>>                              = {};
        this.props.hide.forEach(key => hide[ key ] = true);

        return (
            <header ref={this.setInnerRef} style={style} className={classes(prefixCls, className)}>
                <h3 style={titleStyle} className="header-title">
                    {! hide.icon ? <i className={'mr-xs phpdoc-type-' + file.type}/> : null}
                    <span className={'phpdoc-type-' + file.type} style={{ fontSize: classSize }}>
                        {showNamespace ? file.fqsen.fullName : file.fqsen.entityName}
                    </span>
                    <If condition={! hide.extends && file.entity.extends && file.entity.extends.length}>
                        <small className="pl-xs" style={{ fontSize: textSize }}>extends</small>
                        <PhpdocType className="pl-xs" style={{ fontSize: classSize }} type={file.entity.extends} {...typeProps} />
                    </If>
                    <If condition={! hide.implements && file.isClass && file.class.implements.length > 0}>
                        <small className="pl-xs" style={{ fontSize: textSize }}>implements</small>
                        <PhpdocType className="pl-xs" style={{ fontSize: classSize }} type={file.class.implements} {...typeProps}/>
                    </If>
                </h3>
            </header>

        );
    }
}

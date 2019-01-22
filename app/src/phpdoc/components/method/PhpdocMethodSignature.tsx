import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import './signature.scss';
import { PhpdocMethodComponent, PhpdocMethodComponentBaseProps } from '../PhpdocMethodComponent';
import { PhpdocMethod } from '../../logic';
import { PhpdocType } from '../type/PhpdocType';
import { classes } from 'typestyle';

const log = require('debug')('phpdoc:components:PhpdocMethodSignature');

export interface PhpdocMethodSignatureProps extends PhpdocMethodComponentBaseProps {
    style?: React.CSSProperties
    className?: string;
    prefixCls?: string
    link?: boolean
    inline?: boolean
    noClick?: boolean
    returnCharacter?: string
    innerClass?: string
    size?: string | number

    hide?: {
        inherited?: boolean
        deprecated?: boolean
        modifiers?: boolean
        arguments?: boolean
        argumentTypes?: boolean
        argumentDefaults?: boolean
        returns?: boolean
        namespace?: boolean
        typeTooltip?: boolean
        typeTooltipClick?: boolean
    }
}

@observer
export class PhpdocMethodSignature extends React.Component<PhpdocMethodSignatureProps> {
    static displayName: string                               = 'PhpdocMethodSignature';
    static defaultProps: Partial<PhpdocMethodSignatureProps> = {
        prefixCls      : 'phpdoc-method-signature',
        returnCharacter: '=>',
        size           : 14,
        hide           : {},
    };

    className(...classNames: any[]) {
        const { prefixCls, link, innerClass, inline } = this.props;
        let names                                     = [
            prefixCls,
            inline && 'inline',
            link && prefixCls + '-link',
            innerClass,
            ...classNames,
        ].filter(Boolean);
        return classes(...names);
    }

    render() {
        window[ 'signature' ]          = this;
        const { link, inline }         = this.props;
        const { fqns, method, loader } = this.props;
        return (
            <span style={{ fontSize: this.props.size, ...this.props.style }}>
                <PhpdocMethodComponent fqns={fqns} loader={loader} method={method}>
                    {value => (
                        <Fragment>
                            {
                                link ? <a className={this.className()} onClick={this.onClick}>{this.renderSignature(value)}</a> :
                                inline ? <span className={this.className()}>{this.renderSignature(value)}</span> :
                                <div className={this.className()}>
                                    {inline ? <span>{this.renderSignature(value)}</span> : <div>{this.renderSignature(value)}</div>}
                                    {this.props.children}
                                </div>
                            }
                        </Fragment>
                    )}
                </PhpdocMethodComponent>
            </span>
        );
    }

    renderSignature(method: PhpdocMethod) {
        const { hide, noClick } = this.props;

        let returns = method.returns;
        if ( returns.length && returns[ 0 ] === 'static' ) {
            returns = [ method.fqns.entityName ];
        }

        return (
            <Fragment>
                {/*{! hide.deprecated && method.docblock.tags.has('deprecated') ? <a className="mr-md fs-15">{iconTooltipDeprecated(method)}</a> : null}*/}
                {/*{! hide.inherited && method.inherited_from ? iconTooltipInherited(method, {}, { onClick: this.onInheritedClick }) : null}*/}
                {! hide.inherited && method.inherited_from ? ' ' : null}

                {! hide.modifiers && method.static ? <span className="phpdoc-method-signature-modifier phpdoc-modifier-static">static </span> : null}
                {! hide.modifiers ? <span className={'phpdoc-method-signature-visibility phpdoc-visibility-' + method.visibility}>{method.visibility} </span> : null}
                {! hide.modifiers && method.abstract ? <span className="phpdoc-method-signature-modifier phpdoc-modifier-abstract">abstract </span> : null}

                <span className="phpdoc-method-signature-name">{method.name}</span>
                <span className="phpdoc-method-signature-punctuation">(</span>
                {! hide.arguments ? method.arguments.map((argument, argumentIndex) => (
                    <Fragment key={argumentIndex}>
                        {argumentIndex > 0 ? <span className="phpdoc-method-signature-punctuation">, </span> : null}
                        {! hide.argumentTypes && argument[ 'type' ] ? <PhpdocType type={argument[ 'type' ]} seperator="|" noClick={noClick} showNamespace={! hide.namespace} showTooltip={! hide.typeTooltip} showTooltipClick={! hide.typeTooltipClick}/> : null}
                        {! hide.argumentTypes && argument[ 'type' ] ? ' ' : null}
                        <span className="phpdoc-method-signature-argument">{argument.name}</span>
                        {! hide.argumentDefaults && argument.default ? <span className="phpdoc-method-signature-argument-default">={argument.default}</span> : null}
                    </Fragment>
                )) : null}
                <span className="phpdoc-method-signature-punctuation">)</span>
                {! hide.returns && returns ? <span className="phpdoc-method-signature-return-character"> {this.props.returnCharacter} </span> : null}
                {! hide.returns && returns ? <PhpdocType type={returns} noClick={noClick} showNamespace={! hide.namespace} showTooltip={! hide.typeTooltip} showTooltipClick={! hide.typeTooltipClick}/> : null}
            </Fragment>
        );
    }


    onClick          = () => { };
    onInheritedClick = () => {};
}

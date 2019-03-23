import React, { Fragment } from 'react';
import './method-signature.scss';
import { PhpdocMethod as Method, PhpdocMethod } from '../../logic';
import { PhpdocType } from '../type';
import { classes } from 'typestyle';
import { FQNSComponent, FQNSComponentContext, FQNSComponentProps } from '../base';
import { iconTooltipDeprecated, iconTooltipInherited } from '../tooltips';

const log = require('debug')('phpdoc:components:PhpdocMethodSignature');

export interface PhpdocMethodSignatureProps extends FQNSComponentProps {
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

// @hot(module)
@FQNSComponent()
export default class PhpdocMethodSignature extends React.PureComponent<PhpdocMethodSignatureProps> {
    static displayName: string                               = 'PhpdocMethodSignature';
    static defaultProps: Partial<PhpdocMethodSignatureProps> = {
        prefixCls      : 'phpdoc-method-signature',
        returnCharacter: '=>',
        size           : 14,
        hide           : {},
    };
    static contextType                                       = FQNSComponentContext;
    context!: React.ContextType<typeof FQNSComponentContext>;

    get method(): Method {return this.context.file.entity.methods.get(this.context.fqsen.memberName);};

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
        window[ 'signature' ]  = this;
        const { link, inline } = this.props;
        const { fqsen, file }  = this.context;
        const method           = this.method;
        if ( ! method ) {
            return <span>nomethod</span>;
        }


        return (
            <span style={{ fontSize: this.props.size, ...this.props.style }}>
                {
                    link ? <a className={this.className()} onClick={this.onClick}>{this.renderSignature(method)}</a> :
                    inline ? <span className={this.className()}>{this.renderSignature(method)}</span> :
                    <div className={this.className()}>
                        {inline ? <span>{this.renderSignature(method)}</span> : <div>{this.renderSignature(method)}</div>}
                        {this.props.children}
                    </div>
                }
            </span>
        );
    }

    renderSignature(method: PhpdocMethod) {
        const { hide, noClick } = this.props;

        let returns = method.returns;
        if ( returns.length && returns[ 0 ] === 'static' ) {
            returns = [ method.fqsen.entityName ];
        }

        return (
            <Fragment>
                {! hide.deprecated && method.docblock.tags.has('deprecated') ? <a className="mr-md fs-15">{iconTooltipDeprecated(method)}</a> : null}
                {! hide.inherited && method.inherited_from ? iconTooltipInherited(method, {}, { onClick: this.onInheritedClick }) : null}
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



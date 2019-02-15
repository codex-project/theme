//@ts-ignore TS2307
import React, { Component } from 'react';
import './method.scss';
import PhpdocMethodArguments from './PhpdocMethodArguments';
import { CodeHighlight, HtmlComponents, lazyInject } from '@codex/core';
import { PhpdocTag } from '@codex/api';
import { classes } from 'typestyle';
import { IFQSEN, PhpdocMethod as Method } from '../../logic';
import PhpdocTags from '../tags';
import PhpdocType from '../type';
import PhpdocMethodSignature, { PhpdocMethodSignatureProps } from './PhpdocMethodSignature';
import { FQNSComponent, FQNSComponentCtx } from '../base';
import { hot } from 'react-hot-loader';

const log = require('debug')('phpdoc:components:PhpdocMethod');

export interface PhpdocMethodProps {
    fqsen: IFQSEN
    style?: React.CSSProperties
    className?: string;
    withoutTags?: string[]
    onlyTags?: string[]

    collapse?: boolean
    closed?: boolean
    innerRef?: any
    signature?: React.ReactNode
    signatureProps?: Partial<PhpdocMethodSignatureProps>
    boxed?: boolean

    hide?: {
        signature?: boolean
        details?: boolean
        description?: boolean
        example?: boolean
        tags?: boolean

        inherited?: boolean
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


let renders   = 0;
const hasData = (what) => what !== undefined && what.length > 0;

// export { PhpdocMethod };

// @hot(module)
@FQNSComponent()
export default class PhpdocMethod extends Component<PhpdocMethodProps> {
    static displayName: string                      = 'PhpdocMethod';
    static defaultProps: Partial<PhpdocMethodProps> = {
        withoutTags   : [ 'param', 'example', 'return', 'inherited_from' ],
        hide          : {
            namespace: true,
        },
        signature     : null,
        signatureProps: {},
    };

    static contextType = FQNSComponentCtx;
    context!: React.ContextType<typeof FQNSComponentCtx>;

    @lazyInject('components') hc: HtmlComponents;

    state: { open: boolean } = { open: ! this.props.closed };

    toggleCollapse = () => this.setState({ open: ! this.state.open });

    public shouldComponentUpdate(nextProps: Readonly<PhpdocMethodProps>, nextState: Readonly<{ open: boolean }>, nextContext: React.ContextType<typeof FQNSComponentCtx>): boolean {
        if ( nextState.open !== this.state.open ) {
            log('shouldComponentUpdate', 'nextState.open');
            return true;
        }
        if ( nextContext.file.hash !== this.context.file.hash ) {
            log('shouldComponentUpdate', 'nextContext.file.hash');
            return true;
        }
        return false;
    }

    get method(): Method {return this.context.file.entity.methods.get(this.context.fqsen.memberName);};

    get tags(): PhpdocTag[] {
        if ( this.method && this.method.docblock.tags ) {
            return this.method.docblock.tags;
        }
        return [];
    }

    get filteredTags(): PhpdocTag[] {
        if ( ! this.tags ) return [];
        if ( this.props.onlyTags && this.props.onlyTags.length > 0 ) {
            return this.tags.filter(tag => this.props.onlyTags.includes(tag.name));
        }
        if ( this.props.withoutTags && this.props.withoutTags.length > 0 ) {
            return this.tags.filter(tag => this.props.withoutTags.includes(tag.name) === false);
        }
    }

    get hide(): PhpdocMethodProps['hide'] {return this.props.hide;}

    get has() {
        let m         = this.method;
        const hasData = (what) => what !== undefined && what.length > 0;
        return {
            tags           : hasData(m.docblock.tags),
            returns        : hasData(m.returns),
            description    : hasData(m.docblock.description),
            longDescription: hasData(m.docblock.long_description),
            // 'long-description': hasData(m[ 'long-description' ]),
            arguments      : hasData(m.arguments),
        };
    }

    get show() {
        return {
            description: this.has.description && ! this.hide.description,
            example    : this.method.docblock.tags.has('example') && ! this.hide.example,
            tags       : this.has.tags && ! this.hide.tags && this.filteredTags.length > 0,
            arguments  : this.method.arguments && this.method.arguments.length > 0 && ! this.hide.arguments,
            returns    : this.has.returns && ! this.hide.returns,
        };
    }

    get description() {
        return this.hc.parse(this.method.docblock.description) as any;
    }

    get long_description() {
        return this.method.docblock.long_description ? this.hc.parse(this.method.docblock.long_description) as any : null;
    }

    render() {
        const { innerRef, collapse, boxed, className, hide, signature, signatureProps, style } = this.props;

        const { fqsen } = this.context;
        const method    = this.method;
        let closed      = ! this.state.open;
        let show        = this.show;

        let
            description,
            long_description,
            returns: any
        ;
        if ( show.description ) {
            description      = this.description;
            long_description = this.long_description;
        }

        if ( show.returns ) {
            returns = method.returns;
            if ( returns[ 0 ] === 'static' ) {
                returns = method.fqsen.entityName;
            }
        }

        log('render', { props: this.props });
        return (
            <div ref={innerRef} className={classes('phpdoc-method', className, ...[ boxed && 'boxed', closed && 'closed' ].filter(Boolean))} style={style}>

                <If condition={! hide.signature && signature}>
                    {signature}
                </If>

                <If condition={! hide.signature && ! signature}>
                    <PhpdocMethodSignature fqsen={fqsen} hide={hide} {...signatureProps}>
                        <If condition={collapse}>
                            <a href="javascript:" onClick={this.toggleCollapse}
                               className={classes('method-collapse')} //, { closed })}
                            >{null}</a>
                        </If>
                    </PhpdocMethodSignature>
                </If>

                <If condition={this.state.open}>
                    <div className="method-details">
                        <If condition={show.description}>
                            <div className="method-block pt-md">
                                {description ? <div>{description}</div> : null}
                                {long_description ? <div>{long_description}</div> : null}
                            </div>
                        </If>
                        <If condition={show.example}>
                            <div className="method-block-title">Example</div>
                            <div className="method-block">
                                <CodeHighlight language="php" withLineNumbers code={method.docblock.tags.get('example').description}/>
                            </div>
                        </If>
                        <If condition={show.tags}>
                            <div className="method-block-title">Tags</div>
                            <div className="method-block">
                                <PhpdocTags tags={method.docblock.tags} withoutTags={this.props.withoutTags} onlyTags={this.props.onlyTags}/>
                            </div>
                        </If>
                        <If condition={show.arguments}>
                            <div className="method-block-title">Arguments</div>
                            <PhpdocMethodArguments fqsen={fqsen}>{null}</PhpdocMethodArguments>
                        </If>
                        <If condition={show.returns}>
                            <div className="method-block-title">Returns</div>
                            <div className="method-block">
                                <PhpdocType type={returns}/>
                            </div>
                        </If>
                    </div>
                </If>
            </div>
        );
    }

}

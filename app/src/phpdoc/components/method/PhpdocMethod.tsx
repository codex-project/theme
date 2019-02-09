//@ts-ignore TS2307
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import './method.scss';
import PhpdocMethodArguments from './PhpdocMethodArguments';
import { CodeHighlight, HtmlComponents, lazyInject } from '@codex/core';
import { PhpdocTag } from '@codex/api';
import { classes } from 'typestyle';
import { FQSEN, PhpdocMethod as Method } from '../../logic';
import PhpdocTags from '../tags';
import PhpdocType from '../type';
import PhpdocMethodSignature, { PhpdocMethodSignatureProps } from './PhpdocMethodSignature';
import { PhpdocFileProvider, PhpdocFileProviderProps, withPhpdocFile } from '../providers';
import { FQNSComponent, FQNSComponentCtx, IFQNSComponentCtx } from '../base';

const log = require('debug')('phpdoc:components:PhpdocMethod');

export interface PhpdocMethodBaseProps {
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

export interface PhpdocMethodProps extends PhpdocMethodBaseProps, PhpdocFileProviderProps {

}

let renders   = 0;
const hasData = (what) => what !== undefined && what.length > 0;

export { PhpdocMethod };

@FQNSComponent()
@observer
export default class PhpdocMethod extends Component<PhpdocMethodProps> {
    static displayName: string                      = 'PhpdocMethod';
    static defaultProps: Partial<PhpdocMethodProps> = {
        withoutTags: [ 'param', 'example', 'return' ],
        hide       : {
            namespace: true,
        },
        signature: null,
        signatureProps: {}
    };
    static Arguments: typeof PhpdocMethodArguments  = PhpdocMethodArguments;
    static Signature: typeof PhpdocMethodSignature  = PhpdocMethodSignature;

    static contextType    = FQNSComponentCtx;
    context!: React.ContextType<typeof FQNSComponentCtx>;

    @lazyInject('components') hc: HtmlComponents;

    @observable open: boolean = ! this.props.closed;

    toggleCollapse = () => runInAction(() => this.open = ! this.open);

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


    render() {
        const { innerRef, collapse, boxed, className, hide, signature,signatureProps, style } = this.props;
        const { fqsen }                                                         = this.context;
        const { file }                                                         = this.context;
        if ( ! file.entity.methods.has(fqsen.memberName) ) {
            return <span>nomethod</span>;
        }
        const method = file.entity.methods.get(fqsen.memberName);
        let closed   = ! this.open;

        let show = {
            description: this.has.description && ! this.hide.description,
            example    : method.docblock.tags.has('example') && ! this.hide.example,
            tags       : this.has.tags && ! this.hide.tags && this.filteredTags.length > 0,
            arguments  : method.arguments && method.arguments.length > 0 && ! this.hide.arguments,
            returns    : this.has.returns && ! this.hide.returns,
        };
        let
            description,
            long_description,
            returns: any
        ;
        if ( show.description ) {
            description      = this.hc.parse(method.docblock.description) as any;
            long_description = method.docblock.long_description ? this.hc.parse(method.docblock.long_description) as any : null;
        }

        if ( show.returns ) {
            returns = method.returns;
            if ( returns[ 0 ] === 'static' ) {
                returns = method.fqsen.entityName;
            }
        }

        log('render', { props: this.props, me: this });
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

                <If condition={this.open}>
                    <div className="method-details">
                        {/*{this.renderDescription(method)}*/}
                        <If condition={show.description}>
                            {/*<h4 className="method-block-title">Description</h4>*/}
                            <div className="method-block pt-md">
                                {description ? <div>{description}</div> : null}
                                {long_description ? <div>{long_description}</div> : null}
                            </div>
                        </If>
                        {/*{this.renderExample(method)}*/}
                        <If condition={show.example}>
                            <div className="method-block-title">Example</div>
                            <div className="method-block">
                                <CodeHighlight language="php" withLineNumbers code={method.docblock.tags.get('example').description}/>
                            </div>
                        </If>
                        {/*{this.renderTags(method)}*/}
                        <If condition={show.tags}>
                            <div className="method-block-title">Tags</div>
                            <div className="method-block">
                                <PhpdocTags tags={method.docblock.tags} withoutTags={this.props.withoutTags} onlyTags={this.props.onlyTags}/>
                            </div>
                        </If>
                        {/*{this.renderArguments(method)}*/}
                        <If condition={show.arguments}>
                            <div className="method-block-title">Arguments</div>
                            <PhpdocMethodArguments fqsen={fqsen}>{null}</PhpdocMethodArguments>
                        </If>
                        {/*{this.renderReturns(method)}*/}
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

    // private renderDescription(method: Method): any {
    //     if ( ! this.has.description || this.hide.description ) return null;
    //     const description      = this.hc.parse(method.docblock.description) as any;
    //     const long_description = method.docblock.long_description ? this.hc.parse(method.docblock.long_description) as any : null;
    //     return (
    //         <Fragment>
    //             {/*<h4 className="method-block-title">Description</h4>*/}
    //             <div className="method-block pt-md">
    //                 {description ? <div>{description}</div> : null}
    //                 {long_description ? <div>{long_description}</div> : null}
    //             </div>
    //         </Fragment>
    //     );
    // }
    //
    // private renderExample(method: Method): any {
    //     if ( ! method.docblock.tags.has('example') || this.hide.example ) return null;
    //     return (
    //         <Fragment>
    //             <h4 className="method-block-title">Example</h4>
    //             <div className="method-block">
    //                 <CodeHighlight language="php" withLineNumbers code={method.docblock.tags.get('example').description}/>
    //             </div>
    //         </Fragment>
    //     );
    // }
    //
    // private renderArguments(method: Method): any {
    //     if ( ! method.arguments || method.arguments.length === 0 || this.hide.arguments ) return null;
    //     return (
    //         <Fragment>
    //             <h4 className="method-block-title">Arguments</h4>
    //             <PhpdocMethodArguments fqsen={this.state.fqsen}>{null}</PhpdocMethodArguments>
    //         </Fragment>
    //     );
    // }
    //
    // private renderTags(method: Method) {
    //     if ( ! this.has.tags || this.hide.tags || this.filteredTags.length === 0 ) return null;
    //     return (
    //         <Fragment>
    //             <h4 className="method-block-title">Tags</h4>
    //             <div className="method-block">
    //                 <PhpdocTags tags={method.docblock.tags} withoutTags={this.props.withoutTags} onlyTags={this.props.onlyTags}/>
    //             </div>
    //         </Fragment>
    //     );
    // }
    //
    // private renderReturns(method: Method) {
    //     if ( ! this.has.returns || this.hide.returns ) return null;
    //     let returns: any = method.returns;
    //     if ( returns[ 0 ] === 'static' ) {
    //         returns = method.fqsen.entityName;
    //     }
    //     return (
    //         <Fragment>
    //             <h4 className="method-block-title">Returns</h4>
    //             <div className="method-block">
    //                 <PhpdocType type={returns}/>
    //             </div>
    //         </Fragment>
    //     );
    // }
}

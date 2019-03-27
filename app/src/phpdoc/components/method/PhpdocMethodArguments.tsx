//@ts-ignore TS2307
import React from 'react';
import { observer } from 'mobx-react';
import './method.scss';
import { strEnsureLeft } from '@codex/core';
import { Arguments, IFQSEN, PhpdocMethod as Method } from '../../logic';
import { PhpdocArgument } from '@codex/api';
import {PhpdocType} from '../type';
import { classes } from 'typestyle';
import { FQSENComponent, FQSENComponentContext } from '../base';

const log = require('debug')('phpdoc:components:PhpdocMethod');

export interface PhpdocMethodArgumentsProps {
    fqsen: IFQSEN
    style?: React.CSSProperties
    className?: string;
    prefixCls?: string
    withoutArguments?: string[]
    onlyArguments?: string[]
    innerRef?: any
    hide?: {
        argumentTypes?: boolean
        argumentDefaults?: boolean
        argumentDescription?: boolean
    }
}

const argInArray = (name: string, arr: any[]) => arr.map(name => strEnsureLeft(name, '$')).includes(strEnsureLeft(name, '$'));

@FQSENComponent()
@observer
export class PhpdocMethodArguments extends React.Component<PhpdocMethodArgumentsProps> {
    static displayName: string                               = 'PhpdocMethodArguments';
    static defaultProps: Partial<PhpdocMethodArgumentsProps> = {
        prefixCls: 'phpdoc-method-arguments',
        hide     : {},
    };
    static contextType                                       = FQSENComponentContext;
    context!: React.ContextType<typeof FQSENComponentContext>;

    get method(): Method {return this.context.file.entity.methods.get(this.context.fqsen.memberName);};

    get hide(): PhpdocMethodArgumentsProps['hide'] {return this.props.hide;}

    get arguments(): Arguments {return this.method.arguments;}

    get filteredArguments(): PhpdocArgument[] {
        if ( ! this.method ) return [];

        if ( this.props.onlyArguments ) {
            return this.arguments.only(this.props.onlyArguments);
        }
        if ( this.props.withoutArguments && this.props.withoutArguments.length > 0 ) {
            return this.arguments.without(this.props.withoutArguments);
        }
    }

    className(...classNames: any[]) {
        const { prefixCls } = this.props;
        let names           = [
            prefixCls,
            ...classNames,
        ].filter(Boolean);
        return classes(...names);
    }

    el: React.RefObject<HTMLOListElement> = React.createRef();

    render() {
        if ( ! this.method ) return null;
        const { innerRef, hide, style } = this.props;

        if ( ! this.method.arguments || this.method.arguments.length === 0 ) return null;

        return (
            <ol
                ref={this.el}
                style={style}
                className={this.className('method-block', 'method-arguments')}
            >
                {this.method.arguments.map((argument, argumentIndex) => {
                    return (
                        <li key={argumentIndex}>
                            <If condition={! this.hide.argumentTypes}>
                                <PhpdocType type={argument.types}>{null}</PhpdocType>
                            </If>
                            <span className="method-argument"> {argument.name}</span>
                            <If condition={! this.hide.argumentDefaults && argument[ 'default' ] && argument[ 'default' ].length > 0}>
                                <span className="method-argument-default"> = {argument[ 'default' ]}</span>
                            </If>
                            <If condition={! this.hide.argumentDescription && argument[ 'description' ]}>
                                <span className="method-argument-description" dangerouslySetInnerHTML={{ __html: argument[ 'description' ].replace(/\s*\(optional\)\s*/g, '') }}>{null}</span>
                            </If>

                        </li>
                    );
                })}
            </ol>
        );
    }

}

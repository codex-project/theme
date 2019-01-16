import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { classes, style, types } from 'typestyle'
import {ResizeObservable} from '../observables/ResizeObservable';
import {WindowResizeObservable} from '../observables/WindowResizeObservable';
import { findDOMNode } from 'react-dom';

const log = require('debug')('components:Centered')

export interface CenteredProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;
    fullScreen?: boolean,
    autoHeight?: boolean,
    autoTop?: boolean
}

/**
 * Centered component
 */
@hot(module)
@observer
export  class Centered extends React.Component<CenteredProps> {
    inner: HTMLDivElement;
    static displayName: string                  = 'Centered'
    static defaultProps: Partial<CenteredProps> = {}

    render() {
        // const {} = this.props;
        let containerStyle: React.CSSProperties = {
            top          : 0,
            left         : 0,
            height       : '100%',
            width        : '100%',
            display      : 'table',
            pointerEvents: 'none',
            zIndex       : 9999
        }
        if ( this.props.fullScreen ) {
            containerStyle.position = 'fixed'
        }
        let innerStyle: React.CSSProperties = {
            display      : 'table-cell',
            verticalAlign: 'middle',
            textAlign    : 'center'
        }
        return (
            <div className={classes(style(containerStyle), style(this.props.style), this.props.className)}>
                <ResizeObservable onResize={this.applyChildStyle}/>
                <WindowResizeObservable onResize={this.applyChildStyle}/>
                <div className={style(innerStyle)} ref={ref => this.inner = ref}>
                    {this.props.children}
                </div>
            </div>
        )
    }

    applyChildStyle = () => {
        const { autoHeight, autoTop } = this.props
        if ( ! autoHeight && ! autoTop ) {
            return;
        }
        let el     = findDOMNode(this) as HTMLElement,
            height = 0;
        while ( height === 0 ) {
            if ( ! el ) {
                break;
            }
            if ( el && el.offsetHeight ) {
                height = el.offsetHeight;
            }
            el = el.parentElement;
        }

        if ( this.inner ) {
            let child = this.inner.children.item(0) as HTMLElement;
            if ( child && autoTop ) {
                child.style.top = (height / 2) + 'px';
            } else if ( child && autoHeight ) {
                child.style.height = height + 'px';
            }
        }
    }
}

//@ts-ignore TS2307
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { PopoverProps } from 'antd/es/popover';
import { Popover } from 'antd';
import './popover.scss'
import { Scrollbar } from '@codex/core';
import { hot } from 'react-hot-loader';

const log = require('debug')('components:PhpdocPopover')

export interface PhpdocPopoverProps extends PopoverProps {
    footerText?: string
    maxHeight?: number
    maxWidth?: number
}

@hot(module)
@observer
export class PhpdocPopover extends React.Component<PhpdocPopoverProps> {
    popover: Popover;
    static displayName: string                       = 'PhpdocPopover'
    static defaultProps: Partial<PhpdocPopoverProps> = {}

    render() {
        let { footerText, maxHeight, maxWidth, content, ...rest } = this.props;
        let children                                              = React.Children.toArray(this.props.children)
        let hasContent                                            = content !== undefined && content !== null
        if ( ! hasContent && children && children.length === 1 ) {
            throw new Error('not enuf children')
        }
        if ( ! hasContent ) {
            content = React.cloneElement(children[ 1 ] as any, { key: 'content' })
        }

        if ( maxHeight ) {
            content = <Scrollbar key="scroller" autoHeight={true} autoHeightMax={maxHeight} width="100%" style={{ width: '100%' }}>{children[ 1 ]}</Scrollbar>
        }

        if ( maxWidth ) {
            rest = { ...rest, style: { maxWidth } }
        }

        if ( footerText ) {
            content = [ content, <span key="footer" className="phpdoc-tooltip-footer">{footerText}</span> ]
        }
        return (
            <Popover
                overlayClassName="phpdoc-popover"
                content={content}
                ref={ref => this.popover = ref}
                {...rest}
            >
                {children[ 0 ]}
            </Popover>
        )
    }

}

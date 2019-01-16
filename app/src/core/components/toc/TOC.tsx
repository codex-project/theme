import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { Popover } from 'antd';
import { action, observable } from 'mobx';
import { Toolbar } from 'components/toolbar';
import { Button } from 'components/button';

import './toc.scss';

const log = require('debug')('components:TOC');

export interface TOCProps {
    className?: string
    style?: React.CSSProperties
}

export type TOCComponent = React.ComponentType<TOCProps>


/**
 * TOC component
 */
@hot(module)
@observer
export class TOC extends Component<TOCProps> {
    static displayName: string             = 'TOC';
    static defaultProps: Partial<TOCProps> = {};

    @observable tocPopoverVisible = false;

    @action toggleTocPopover(tocPopoverVisible?: boolean) {this.tocPopoverVisible = tocPopoverVisible !== undefined ? tocPopoverVisible : ! this.tocPopoverVisible;}


    render() {
        const { className, style, children } = this.props;

        return (
            <Toolbar.Item side="right">
                <Button.Group>
                    <Popover
                        title="Table of Contents"
                        trigger="hover"
                        mouseEnterDelay={0}
                        align={{
                            points: [ 'tr', 'br' ],
                            offset: [ - 10, 10 ],
                        }}
                        visible={this.tocPopoverVisible}
                        onVisibleChange={visible => this.toggleTocPopover(visible)}
                        content={<div className="c-toc">{children}</div>}
                        autoAdjustOverflow
                        placement={'bottomLeft'}
                        style={{ minWidth: 100, maxWidth: 150 }}
                    >
                        <Button borderless type="toolbar" icon="list-alt">Table of Contents</Button>
                    </Popover>

                </Button.Group>
            </Toolbar.Item>
        );
    }

}

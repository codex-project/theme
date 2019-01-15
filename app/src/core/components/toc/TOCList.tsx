import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { classes } from 'typestyle';
import { Toolbar } from 'components/toolbar/Toolbar';
import { Button } from 'components/toolbar/Button';
import { Popover } from 'antd';
import { action, observable } from 'mobx';


const log = require('debug')('components:TOC');

export interface TOCListProps {
    className?: string
    style?: React.CSSProperties
}

export type TOCListComponent = React.ComponentType<TOCListProps>


/**
 * TOC component
 */
@hot(module)
@observer
export class TOCList extends Component<TOCListProps> {
    static displayName: string                 = 'TOCList';
    static defaultProps: Partial<TOCListProps> = {};

    @observable tocPopoverVisible = false;

    @action toggleTocPopover(tocPopoverVisible?: boolean) {this.tocPopoverVisible = tocPopoverVisible !== undefined ? tocPopoverVisible : ! this.tocPopoverVisible;}

    render() {
        const { className, style, children } = this.props;

        return null;
        return (
            <Toolbar.Item side="right">
                <Button.Group>
                    <Popover
                        title="Table of Contents"
                        trigger="click"
                        visible={this.tocPopoverVisible}
                        onVisibleChange={visible => this.toggleTocPopover(visible)}
                        content={
                            <ul style={style} className={classes('c-toc', 'c-toc-list', className)}>
                                {children}
                            </ul>
                        }
                    >
                        <Button borderless type="toolbar" icon="list-alt" title="Show the Table of Contents">Table of Contents</Button>
                    </Popover>

                </Button.Group>
            </Toolbar.Item>
        );
    }

}

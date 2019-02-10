import React, { Component, Fragment } from 'react';
import { Observer, observer } from 'mobx-react';

import { hot } from 'decorators';
import { Drawer, Popover } from 'antd';
import { Toolbar } from '../toolbar';
import { Button } from '../button';


const log = require('debug')('components:TOC');

export interface TOCProps {
    className?: string
    style?: React.CSSProperties
    type?: 'popover' | 'drawer'
}

export type TOCComponent = React.ComponentType<TOCProps>


/**
 * TOC component
 */
@hot(module)
@observer
export class TOC extends Component<TOCProps> {
    static displayName: string             = 'TOC';
    static defaultProps: Partial<TOCProps> = {
        type: 'drawer',
    };
    state = { visible: false };

    setVisible = (visible: boolean = true) => {this.setState({ visible }); };
    showDrawer = () => { this.setVisible(true);};
    hideDrawer = () => { this.setVisible(false);};

    render() {
        window[ 'toc' ]                            = this;
        const { className, style, children, type } = this.props;

        return (
            <Fragment>
                <Toolbar.Item side="right">
                    <Observer>{() =>
                        <Button.Group>
                            <If condition={type === 'popover'}>
                                <Popover
                                    title="Table of Contents"
                                    trigger="hover"
                                    mouseEnterDelay={0}
                                    align={{
                                        points: [ 'tr', 'br' ],
                                        offset: [ - 10, 10 ],
                                    }}
                                    visible={this.state.visible}
                                    onVisibleChange={this.setVisible}
                                    content={<div className="c-toc">{children}</div>}
                                    autoAdjustOverflow
                                    placement={'bottomLeft'}
                                    style={{ minWidth: 100, maxWidth: 150 }}
                                >
                                    <Button borderless type="toolbar" icon="list-alt">Table of Contents</Button>
                                </Popover>
                            </If>
                            <If condition={type === 'drawer'}>
                                <Button borderless type="toolbar" icon="list-alt" onClick={this.showDrawer}>Table of Contents</Button>
                            </If>
                        </Button.Group>
                    }</Observer>
                </Toolbar.Item>
                <If condition={type === 'drawer'}>
                    <Drawer
                        closable={true}
                        visible={this.state.visible}
                        onClose={this.hideDrawer}
                        duration="0.1s"
                    >
                        <div className="c-toc" onClick={this.hideDrawer}>{children}</div>
                    </Drawer>
                </If>
            </Fragment>
        );
    }

}

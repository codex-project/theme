import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Tabs as AntdTabs } from 'antd';
import { TabPaneProps as AntdTabPaneProps } from 'antd/lib/tabs';

const AntdTabPane = AntdTabs.TabPane;

export interface TabProps extends AntdTabPaneProps {
    className?: string
    style?: React.CSSProperties
}

@hot(module)
export class Tab extends Component<TabProps> {
    static displayName                     = 'Tab';
    static defaultProps: Partial<TabProps> = {};

    render() {
        const { children, className, style, ...props } = this.props;
        return (
            <AntdTabPane {...props} className={className} style={style}>
                {children}
            </AntdTabPane>
        );
    }
}


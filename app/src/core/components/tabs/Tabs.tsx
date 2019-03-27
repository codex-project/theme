import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Tabs as AntdTabs } from 'antd';
import { TabsProps as AntdTabsProps } from 'antd/lib/tabs';

import './tabs.scss'

export interface TabsProps extends AntdTabsProps {
    className?: string
    style?: React.CSSProperties
}

@hot(module)
export class Tabs extends Component<TabsProps> {
    static displayName                      = 'Tabs';
    static defaultProps: Partial<TabsProps> = {};

    render() {
        const { children, className, style, ...props } = this.props;
        React.Children.map(children, (child, index) => React.cloneElement(child as any, {key:index}))
        return (

            <AntdTabs {...props} className={className} style={style}>
                {children}
            </AntdTabs>
        );
    }
}


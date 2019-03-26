import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import classNames from 'classnames';
import { getElementType } from 'utils/getElementType';

export interface SettingsProps {
    as?: React.ElementType
    style?: React.CSSProperties
    className?: string
    prefixCls?: string
}


@hot(module)
export class Settings extends Component<SettingsProps> {
    static displayName                          = 'Settings';
    static defaultProps: Partial<SettingsProps> = {
        as       : 'div',
        prefixCls: 'c-settings',
    };

    render() {
        const { children,prefixCls,style, ...props } = this.props;
        const ElementType = getElementType(Settings, this.props)
        return (
            <ElementType className={classNames(prefixCls)}>
                <h2>Settings</h2>
                {children}
            </ElementType>
        );
    }
}

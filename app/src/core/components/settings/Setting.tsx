import React, { Component } from 'react';

export interface SettingProps {}

export class Setting extends Component<SettingProps> {
    static displayName                         = 'Setting';
    static defaultProps: Partial<SettingProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                {children}
            </div>
        );
    }
}


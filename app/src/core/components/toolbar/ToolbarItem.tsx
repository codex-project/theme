import React, { Component } from 'react';
import { Tunnel } from 'components/tunnel';
import { strEnsureLeft } from 'utils/general';

export interface ToolbarItemProps {
    side?: 'left' | 'right'
}

export class ToolbarItem extends Component<ToolbarItemProps> {
    static displayName                             = 'ToolbarItem';
    static defaultProps: Partial<ToolbarItemProps> = {
        side: 'left'
    };

    render() {
        const { side,children } = this.props;
        return (
            <Tunnel id={strEnsureLeft(side, 'toolbar-')}>
                {children}
            </Tunnel>
        );
    }
}

export default ToolbarItem;

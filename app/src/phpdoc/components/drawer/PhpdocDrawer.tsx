import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { FQNSComponent, FQNSComponentCtx } from '../base';
import { observer } from 'mobx-react';
import { OffCanvas } from '@codex/core';

export interface PhpdocDrawerProps {}

@hot(module)
@FQNSComponent()
@observer
export default class PhpdocDrawer extends Component<PhpdocDrawerProps> {
    static displayName                              = 'PhpdocDrawer';
    static defaultProps: Partial<PhpdocDrawerProps> = {};
    static contextType                              = FQNSComponentCtx;
    context!: React.ContextType<typeof FQNSComponentCtx>;
    private _offCanvas                                      = React.createRef<OffCanvas>();
    public get offCanvas(): OffCanvas {return this._offCanvas.current;}

    render() {
        const { children, ...props } = this.props;
        return (
            <OffCanvas
                ref={this._offCanvas}
                position="left"
            >
                {children}
            </OffCanvas>
        );
    }
}


import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { FQNSComponent, FQNSComponentContext, FQNSComponentProps } from '../base';
import { observer } from 'mobx-react';
import { app, OffCanvas } from '@codex/core';
import ReactDOM from 'react-dom';

class AppendToRoot extends React.Component {
    static displayName='AppendToRoot';
    render() {
        return ReactDOM.createPortal(this.props.children, window.document.getElementById(app.config.rootID));
    }
}

export interface PhpdocDrawerProps {}

@hot(module)
@FQNSComponent()
@observer
export default class PhpdocDrawer extends Component<PhpdocDrawerProps & FQNSComponentProps> {
    static displayName                              = 'PhpdocDrawer';
    static defaultProps: Partial<PhpdocDrawerProps> = {};
    static contextType                              = FQNSComponentContext;
    context!: React.ContextType<typeof FQNSComponentContext>;
    private _offCanvas                              = React.createRef<typeof OffCanvas>();
    public get offCanvas(): typeof OffCanvas {return this._offCanvas.current;}

    render() {
        const { children, ...props } = this.props;
        return (
            <AppendToRoot>
                <OffCanvas
                    ref={this._offCanvas}
                    position="left"
                >
                    {children}
                </OffCanvas>
            </AppendToRoot>
        );
    }
}


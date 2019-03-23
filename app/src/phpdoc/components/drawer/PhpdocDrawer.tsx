import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { FQNSComponent, FQNSComponentContext, FQNSComponentProps } from '../base';
import { observer } from 'mobx-react';
import { app, h, OffCanvas } from '@codex/core';
import ReactDOM from 'react-dom';
import { OffCanvasProps } from '@codex/core/components/off-canvas/OffCanvas';

class AppendToRoot extends React.Component {
    static displayName = 'AppendToRoot';

    render() {
        return ReactDOM.createPortal(this.props.children, window.document.getElementById(app.config.rootID));
    }
}

export interface PhpdocDrawerProps extends Partial<OffCanvasProps> {}

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

                    {...props}
                    ref={this._offCanvas}

                    position="left"
                >
                    {this.context.fqsen.isEntity ? this.renderEntity() : null}
                    {children}
                </OffCanvas>
            </AppendToRoot>
        );
    }

    renderEntity() {
        const { fqsen } = this.context;
        return h('div', {}, h([
            h('phpdoc-entity', { fqsen }),
        ]));
    }
}


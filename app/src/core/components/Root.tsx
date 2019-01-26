import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { app } from 'ioc';
import { App } from 'components/App';

export interface RootProps {}

class Root extends Component<RootProps> {
    static displayName                      = 'Root';
    static defaultProps: Partial<RootProps> = {};

    render() {
        const { children, ...props } = this.props;
        let previousWrapper: any     = React.createElement(App);
        Array.from(app.renderWrappers).forEach(wrapper => {
            let props   = {};
            let Wrapper = wrapper;
            if ( Array.isArray(wrapper) ) {
                [ Wrapper, props ] = wrapper;
            }
            previousWrapper = React.createElement(Wrapper, props, previousWrapper);
        });
        return previousWrapper;
    }
}

export default hot(Root);

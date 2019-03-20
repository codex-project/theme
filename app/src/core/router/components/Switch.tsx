import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { Router } from './../Router';
import { State } from '../State';

const log = require('debug')('router:components:Switch');

export interface SwitchProps {
    state: State
}

@hot(module)
export class Switch extends Component<SwitchProps> {
    static displayName                        = 'Switch';
    static defaultProps: Partial<SwitchProps> = {};

    @lazyInject('router') router: Router;

    public componentDidMount(): void {
    }

    render() {
        const { children, state, ...props } = this.props;
        let element, match;

        React.Children.forEach(children, child => {
            if ( match == null && React.isValidElement(child) ) {
                element = child;
                if ( child.props[ 'name' ] === state.name ) {
                    match = true;
                }
            }
        });

        return element ? React.cloneElement(element, { match, state }) : null;
    }
}

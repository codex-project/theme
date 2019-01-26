import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

export interface TestHmrProps {}

class TestHmr extends Component<TestHmrProps> {
    static displayName                         = 'TestHmr';
    static defaultProps: Partial<TestHmrProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <p>TestfHfMR</p>
                <p>{children}</p>
            </div>
        );
    }
}

export default hot(module)(TestHmr);

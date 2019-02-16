import React, { Component } from 'react';
import { CSSModules, Hot, styled } from 'codex_core';
// import CSSModules22 from 'react-css-modules';
import styles from './TestCssModule.module.scss'

const TestStyledH3 = styled.h4(p => ({
    background: p.theme.colors.primary
}));

const log = require('debug')('components:TestCssModule')

export interface TestCssModuleProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;
}

@Hot(module)
@CSSModules(styles)
export class TestCssModule extends Component<TestCssModuleProps & CSSModules.InjectedCSSModuleProps> {
    static displayName: string                       = 'TestCssModule'
    static defaultProps: Partial<TestCssModuleProps> = {}

    render() {
        // const {} = this.props;
        window[ TestCssModule.displayName ] = styles;
        return (
            <div styleName="test-css-module">
                <p>Hello <a href="#"> TestCssModule </a>!</p>
                <TestStyledH3>
                    TestStyledH3
                </TestStyledH3>
            </div>
        )
    }
}

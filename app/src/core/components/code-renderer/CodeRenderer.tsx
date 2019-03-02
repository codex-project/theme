import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import { Chart, Mathematica, Mermaid } from 'components/code-renderer/renderers';
import { ErrorBoundary } from 'components/errors';

export interface CodeRendererProps {
    language: string

}


export { CodeRenderer };

@hot(module)
@observer
export default class CodeRenderer extends Component<CodeRendererProps> {
    static displayName                              = 'CodeRenderer';
    static defaultProps: Partial<CodeRendererProps> = {};

    render() {
        const { children, language, ...props } = this.props;
        return (
            <div className="c-code-renderer">
                <ErrorBoundary>
                    <If condition={language === 'mermaid'}>
                        <Mermaid diagram={this.props.children.toString()} />
                    </If>
                    <If condition={language === 'chart'}>
                        <Chart chart={JSON.parse(this.props.children.toString())}/>
                    </If>
                    <If condition={[ 'katex', 'asciimath' ].includes(language)}>
                        <Mathematica language={language}>{this.props.children}</Mathematica>
                    </If>
                </ErrorBoundary>
            </div>
        );
    }
}


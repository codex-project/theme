import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import { KatexOptions, renderToString } from 'katex';
import { Alert } from 'antd';

export interface MathematicaProps {
    language: string
    katexOptions?: KatexOptions
}

let katexStyleImported = false;
const importKatexStyle = () => {
    if ( katexStyleImported ) return;
    import('./mathematica.katex.less');
    katexStyleImported = true;
};


@hot(module)
@observer
export default class Mathematica extends Component<MathematicaProps> {
    static displayName                             = 'Mathematica';
    static defaultProps: Partial<MathematicaProps> = {};

    state = { formula: 'Loading formula...', error: null, showErrorDetails: false };

    ref = React.createRef<HTMLDivElement>();

    public componentDidMount(): void {
        let language = this.props.language;
        if ( language === 'katex' ) {
            importKatexStyle();
            this.renderKatex();
        }
    }

    onShowErrorClick = (e) => this.setState({ showErrorDetails: ! this.state.showErrorDetails });

    render() {
        const { children, language, katexOptions, ...props } = this.props;
        const { formula, error, showErrorDetails }           = this.state;
        if ( error ) {
            return (
                <Alert
                    showIcon
                    type="error"
                    message={<span>Render Error. <small><a onClick={this.onShowErrorClick}>{showErrorDetails ? 'hide' : 'show'}</a></small></span>}
                    description={showErrorDetails ? <pre><code>{error.toString()}</code></pre> : null}
                />
            );
        }
        return (
            <div
                className={`mathematica ${language}`}
                dangerouslySetInnerHTML={{ __html: formula }}
            />
        );
    }

    renderKatex() {
        try {
            const html = renderToString(this.props.children.toString(), this.props.katexOptions);
            this.setState({ formula: html });
        } catch ( e ) {
            this.setState({ error: e });
        }
    }
}


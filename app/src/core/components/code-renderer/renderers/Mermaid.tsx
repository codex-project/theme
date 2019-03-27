import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import mermaid from 'mermaid';
import { getRandomId } from 'utils/general';
import { Alert } from 'antd';
import { styleToString } from 'utils/styleToString';
import _ReactIframeResizer, { ReactIframeResizerProps } from 'react-iframe-resizer-super';
import * as iframeResizer from 'iframe-resizer';

class ReactIframeResizer extends _ReactIframeResizer {
    initialized  = false;
    resizeIframe = (props) => {
        const frame = this.refs.frame;
        if ( ! frame ) return;
        if ( ! this.initialized ) {
            if ( props.iframeResizerEnable ) {
                this.initialized = true;
                iframeResizer['iframeResizer'](props.iframeResizerOptions, frame as any);
            }
        }
    };
}

mermaid.mermaidAPI.initialize({
    startOnLoad: false,
});

export interface MermaidProps {
    id?: string
    style?: React.CSSProperties
    diagram: string
    frame?: ReactIframeResizerProps
}


function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}


@hot(module)
@observer
export class Mermaid extends Component<MermaidProps> {
    static displayName                         = 'Mermaid';
    static defaultProps: Partial<MermaidProps> = {
        style: {
            // height: '100%',
            // width : '100%',
        },
        frame: {
            frameBorder         : 0,
            iframeResizerOptions: {
                log         : false,
                autoResize  : true,
                checkOrigin : false,
                initCallback: (iframe: iframeResizer.IFrameComponent) => {

                },

            },
        },
    };
    // containerRef = React.createRef<HTMLDivElement>();
    state                                      = { diagram: 'Loading diagram...', error: null, showErrorDetails: false };

    get id(): string { return this.props.id || 'mermaid-' + getRandomId(10);}

    public componentDidMount(): void {
        this.renderMermaid(this.props.diagram);
    }

    public componentWillReceiveProps({ diagram }): void {
        this.renderMermaid(diagram);
    }


    onShowErrorClick = (e) => this.setState({ showErrorDetails: ! this.state.showErrorDetails });

    render() {
        const { children, style, frame, ...props } = this.props;
        const { diagram, error, showErrorDetails } = this.state;
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


        const template = `
<!DOCTYPE html>
<html>
<body>
<style>
body {
margin: 0;
padding: 0;
}
${styleToString(style)}
</style>
${diagram}
</body>
</html>
        `;

        return (
            <ReactIframeResizer content={template} {...frame || {}} />
        );

        // return (
        //     <div>
        //         <div id={this.id + '_container'} style={{ display: 'none' }} ref={this.containerRef}/>
        //         <div
        //             className="mermaid"
        //             dangerouslySetInnerHTML={{ __html: diagram }}
        //         />
        //     </div>
        // );
    }

    renderMermaid(diagram) {
        try {
            mermaid.mermaidAPI.render(
                this.id,
                diagram,
                (html) => this.setState({ diagram: html }),
                // this.containerRef.current as any,
            );
        } catch ( e ) {
            this.setState({ error: e });
        }
    }
}


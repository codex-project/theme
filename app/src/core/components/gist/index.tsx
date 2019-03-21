import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import classNames from 'classnames';
import './gist.scss';

export interface GistProps {
    gist: string;
    file?: string;
    loading?: React.ReactElement
    className?: string
    style?: React.CSSProperties
}


@hot(module)
export class Gist extends Component<GistProps> {
    static displayName                      = 'Gist';
    static defaultProps: Partial<GistProps> = {
        style  : {},
        loading: <div>Loading...</div>,
    };
    static gistCallbackId                   = 0;

    static nextGistCallback() {
        return 'code_renderer_gist_callback_' + this.gistCallbackId ++;
    }

    static stylesheetAdded = false;

    static addStylesheet(href) {
        if ( this.stylesheetAdded ) {
            return;
        }
        this.stylesheetAdded = true;
        const link           = document.createElement('link');
        link.type            = 'text/css';
        link.rel             = 'stylesheet';
        link.href            = href;

        document.head.appendChild(link);
    }

    state = { isLoading: true, src: '', url: '', mounted: false };

    protected createGistCallback(gist: string, file?: string) {
        return () => {
            const callbackName = Gist.nextGistCallback();
            let url            = `https://gist.github.com/${gist}.json?callback=${callbackName}`;
            if ( file ) {
                url += `&file=${file}`;
            }
            window[ callbackName ] = (data: any) => {
                if ( this.state.mounted ) {
                    this.setState({ isLoading: false, src: data.div, url });
                }
                Gist.addStylesheet(data.stylesheet);
            };
            const script           = document.createElement('script');
            script.type            = 'text/javascript';
            script.src             = url;
            document.head.appendChild(script);
        };
    }

    componentDidMount(): void {
        const callback = this.createGistCallback(this.props.gist, this.props.file);
        this.setState({ mounted: true }, () => {callback(); });
    }

    componentWillUnmount(): void {
        this.setState({ mounted: false });
    }


    render() {
        const { children, gist, file, loading, className, style, ...props } = this.props;
        const { mounted, isLoading, src }                                   = this.state;

        return (
            <div className={classNames('c-gist', className)} style={style}>
                <If condition={isLoading}>{React.cloneElement(loading, { key: 'loading', className: 'c-gist-loading' })}</If>
                <If condition={! isLoading}>
                    <div key={gist + file} className="c-gist-inner" dangerouslySetInnerHTML={{ __html: src }}/>
                </If>
            </div>
        );
    }

}


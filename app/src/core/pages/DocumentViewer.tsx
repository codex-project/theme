import React from 'react';
import { Api, api } from '@codex/api';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { lazyInject } from 'ioc';
import { HtmlParser } from 'classes/HtmlParser';
import { Store } from 'stores';
import Helmet from 'react-helmet';

const uuid = require('uuid').v4;

const log = require('debug')('pages:DocumentViewer');

export interface DocumentViewerProps extends React.HTMLAttributes<HTMLDivElement> {
    project: string
    revision: string
    document: string
}


export interface RunScriptProps {
    scripts: any[]
}

export class Scripts extends React.Component<RunScriptProps> {
    static displayName                           = 'RunScript';
    static defaultProps: Partial<RunScriptProps> = {};
    state                                        = { done: false };

    public componentDidMount(): void {
        if ( this.state.done ) {
            return;
        }
        const head = window.document.head;
        this.props.scripts.forEach(script => {
            let s  = window.document.createElement('script');
            s.type = 'text/javascript';
            s.src  = script;
            head.append(s);
            this.setState({ done: true });
        });
    }

    render() {
        const { children, ...props } = this.props;
        return null;
    }
}


@observer
export default class DocumentViewer extends React.Component<DocumentViewerProps> {
    @lazyInject('api') api: Api;
    @lazyInject('htmlparser') htmlParser: HtmlParser;
    @lazyInject('store') store: Store;
    static displayName = 'DocumentViewer';

    @observable document: api.Document = null;
    @observable mounted=false;

    async componentDidMount() {
        const { children, project, revision, document, ...props } = this.props;
        this.store.fetchDocument(project, revision, document).then(document => {
            runInAction(() => {
                this.document = document;
                this.mounted=true;
                // this.document.scripts.map(script => new Function('require',script)).forEach(fn => fn())
            });
        });
    }

    public componentDidUpdate(prevProps: Readonly<DocumentViewerProps>, prevState: Readonly<{}>, snapshot?: any): void {

    }


    render() {
        const { children, ...props } = this.props;

        let content = null;
        if ( this.document && this.document.content ) {
            try {
                content = this.htmlParser.parse(this.document.content);
                content = (
                    <div id="document">
                        <Helmet>
                            <title>{this.document.title || this.document.key}</title>
                        </Helmet>
                        {content}
                        <If condition={this.document.scripts}>
                            <Scripts scripts={this.document.scripts}/>
                        </If>
                        {/*<If condition={this.document.html}>*/}
                        {/*<div dangerouslySetInnerHTML={{__html: this.document.html.join('\n')}}/>*/}
                        {/*</If>*/}
                    </div>
                );
            } catch ( e ) {
                console.warn(e);
            }
        }
        return content;
    }

    // async fetch() {
    //     const { project, revision, document } = this.props.routeState.params;
    //     this.store.setDocument(null);
    //     try {
    //         await this.store.fetchDocument(project, revision, document);
    //     } catch ( e ) {
    //         app.notification.error({
    //             message  : e && e.message ? e.message : 'Document does not exist',
    //             placement: 'bottomRight',
    //         });
    //     }
    // }
    //
    // public componentDidMount(): void {
    //     log('componentDidMount');
    //     this.fetch();
    // }
    //
    // public componentDidUpdate(prevProps: Readonly<DocumentViewerProps>, prevState: Readonly<{}>, snapshot?: any): void {
    //     // this.fetch();
    // }

}


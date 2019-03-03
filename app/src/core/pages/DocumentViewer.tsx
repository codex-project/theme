import * as React from 'react';
import { Api, api } from '@codex/api';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { lazyInject } from 'ioc';
import { HtmlComponents } from 'classes/HtmlComponents';
import { Store } from 'stores';
import Helmet from 'react-helmet';

const log = require('debug')('pages:DocumentViewer');

export interface DocumentViewerProps extends React.HTMLAttributes<HTMLDivElement> {
    project: string
    revision: string
    document: string
}

@observer
export default class DocumentViewer extends React.Component<DocumentViewerProps> {
    @lazyInject('api') api: Api;
    @lazyInject('components') hc: HtmlComponents;
    @lazyInject('store') store: Store;
    static displayName = 'DocumentViewer';


    @observable document: api.Document = null;

    async componentDidMount() {
        const { children, project, revision, document, ...props } = this.props;
        this.store.fetchDocument(project, revision, document).then(document => {
            runInAction(() => this.document = document);
        });
    }

    render() {
        const { children, ...props } = this.props;

        let content = null;
        if ( this.document ) {
            try {
                content = this.hc.parse(this.document.content);
                content = (
                    <div id="document">
                        <Helmet>
                            <title>{this.document.title || this.document.key}</title>
                        </Helmet>
                        {content}
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


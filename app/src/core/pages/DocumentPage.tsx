import * as React from 'react';
import { Api } from '@codex/api';
import PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import Helmet from 'react-helmet';
import posed from 'react-pose';
import { observable, runInAction, toJS } from 'mobx';
import { State } from 'router';
import { app, lazyInject } from 'ioc';
import { HtmlComponents } from 'classes/HtmlComponents';
import { Store } from 'stores';

const log = require('debug')('pages:DocumentPage');

export interface DocumentPageProps extends React.HTMLAttributes<HTMLDivElement> {
    routeState: State
    project: string
    revision: string
    document: string
}

const DocumentContainer = posed.div({
    enter: {
        opacity: 1,
        delay  : 500,
    },
    exit : {
        opacity   : 0,
        transition: { duration: 500 },
    },
});
@observer
export default class DocumentPage extends React.Component<DocumentPageProps > {
    @lazyInject('api') api: Api;
    @lazyInject('components') hc: HtmlComponents;
    @lazyInject('store') store: Store;

    static displayName = 'DocumentPage';

    static childContextTypes = { document: PropTypes.object };

    getChildContext() {
        return { document: toJS(this.document) };
    }

    @observable document = null;

    async fetch() {
        const { project, revision, document } = this.props.routeState.params;
        try {
            let doc = await this.store.fetchDocument(project, revision, document);
            runInAction(() => this.document = doc);
        } catch ( e ) {
            app.notification.error({
                message  : e && e.message ? e.message : 'Document does not exist',
                placement: 'bottomRight',
            });
        }
        // if ( ! this.store.isDocument(project, revision, document) ) {
        //     // this.store.setDocument(null);
        //     try {
        //         let promise = this.store.fetchDocument(project, revision, document);
        //         this.store.setDocument(null);
        //         await promise;
        //     } catch ( e ) {
        //         console.trace(project +revision+document,e)
        //         app.notification.error({
        //             message  : e && e.message ? e.message : 'Document does not exist',
        //             placement: 'bottomRight',
        //         });
        //     }
        // }
    }

    public componentDidMount(): void {
        log('componentDidMount');
        this.fetch();
    }

    public componentDidUpdate(prevProps: Readonly<DocumentPageProps & RouteComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.fetch();
    }

    render() {
        const { children, routeState, ...props } = this.props;
        // const { document }                                                                = this.store;

        ! this.document && log('render', 'NO DOCUMENT', { document: this.document, props });
        this.document && log('render', 'WITH DOCUMENT', this.document.key, { document: this.document, props });
        let content = null;
        if ( this.document ) {
            try {
                content = this.hc.parse(this.document.content);
            } catch ( e ) {
                console.warn(e);
            }
        }
        return (
            <DocumentContainer id="document" pose={this.document ? 'enter' : 'exit'} {...props}>
                <If condition={this.document}>
                    <Helmet>
                        <title>{this.document.title || this.document.key}</title>
                    </Helmet>
                    {content}
                </If>
            </DocumentContainer>
        );
    }
}


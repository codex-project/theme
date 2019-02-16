import * as React from 'react';
import { Api } from '@codex/api';
import PropTypes from 'prop-types';
import { BrowserRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import Helmet from 'react-helmet';
import posed from 'react-pose';
import { toJS } from 'mobx';
import { RouteState } from 'router';
import { app, lazyInject } from 'ioc';
import { HtmlComponents } from 'classes/HtmlComponents';
import { Store } from 'stores';

const log = require('debug')('pages:DocumentPage');

export interface DocumentPageProps extends React.HTMLAttributes<HTMLDivElement> {
    routeState: RouteState
    project: string
    revision: string
    document: string
}

const DocumentContainer = posed.div({
    enter: {
        opacity: 1,
        delay  : 500,

        // afterChildren : true,
        // height        : '100%',
        // position      : 'relative',
    },
    exit : {
        opacity   : 0,
        transition: { duration: 500 },
        // delay         : 500,
        // beforeChildren: true,
        // afterChildren : true,
        // beforeChildren: true,
        // height        : '100%',
        // position      : 'relative',
    },
});
@observer
export default class DocumentPage extends React.Component<DocumentPageProps & RouteComponentProps> {
    @lazyInject('api') api: Api;
    @lazyInject('components') hc: HtmlComponents;
    @lazyInject('store') store: Store;

    static displayName = 'DocumentPage';

    static childContextTypes = {
        router    : PropTypes.object.isRequired,
        document  : PropTypes.object,
        attributes: PropTypes.object,
    };

    getChildContext() {
        return {
            router  : app.get<BrowserRouter>('router'),
            document: toJS(this.store.document),
        };
    }

    async fetch() {
        const { project, revision, document } = this.props;
        if ( ! this.store.isDocument(project, revision, document) ) {
            this.store.setDocument(null);
            try {
                await this.store.fetchDocument(project, revision, document);
            } catch ( e ) {
                app.notification.error({
                    message  : e && e.message ? e.message : 'Document does not exist',
                    placement: 'bottomRight',
                });
            }
        }
    }

    public componentDidMount(): void {
        this.fetch();
    }

    public componentDidUpdate(prevProps: Readonly<DocumentPageProps & RouteComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.fetch();
    }

    render() {
        const { children, routeState, history, staticContext, location, match, ...props } = this.props;
        const { document }                                                                = this.store;

        ! document && log('render', 'NO DOCUMENT', { document, props });
        document && log('render', 'WITH DOCUMENT', document.key, { document, props });
        let content = null;
        if ( document ) {
            try {
                content = this.hc.parse(document.content);
            } catch ( e ) {
                console.warn(e);
            }
        }
        return (
            <DocumentContainer id="document" pose={document ? 'enter' : 'exit'} {...props}>
                <If condition={document}>
                    <Helmet>
                        <title>{document.title || document.key}</title>
                    </Helmet>
                    {content}
                </If>
            </DocumentContainer>
        );
    }
}


import React from 'react';
import { Api } from '@codex/api';
import { State } from 'router';
import { lazyInject } from 'ioc';
import { HtmlParser } from 'classes/HtmlParser';
import { Store } from 'stores';
import { hot } from 'react-hot-loader';
import DocumentViewer from 'pages/DocumentViewer';

const log = require('debug')('pages:DocumentPage');

export interface DocumentPageProps extends React.HTMLAttributes<HTMLDivElement> {
    routeState: State
    project: string
    revision: string
    document: string
}

@hot(module)
export default class DocumentPage extends React.Component<DocumentPageProps> {
    @lazyInject('api') api: Api;
    @lazyInject('htmlparser') htmlParser: HtmlParser;
    @lazyInject('store') store: Store;

    static displayName = 'DocumentPage';

    render() {
        const { children, routeState }        = this.props;
        const { project, revision, document } = routeState.params;

        return <DocumentViewer project={project} revision={revision} document={document}/>;

    }
}


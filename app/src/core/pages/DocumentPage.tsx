import * as React from 'react';
import { Api } from '@codex/api';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Helmet from 'react-helmet';
import posed from 'react-pose';
import { toJS } from 'mobx';
import { State } from 'router';
import { app, lazyInject } from 'ioc';
import { HtmlComponents } from 'classes/HtmlComponents';
import { Store } from 'stores';
import { hot } from 'react-hot-loader';
import DocumentViewer from 'pages/DocumentViewer';

const log = require('debug')('pages:DocumentPage');

export interface DocumentPageProps extends React.HTMLAttributes<HTMLDivElement> {
    routeState:State
    project: string
    revision: string
    document: string
}

@hot(module)
export default class DocumentPage extends React.Component<DocumentPageProps> {
    @lazyInject('api') api: Api;
    @lazyInject('components') hc: HtmlComponents;
    @lazyInject('store') store: Store;

    static displayName = 'DocumentPage';

    render() {
        const { children, routeState} = this.props;
        const {project, revision, document} = routeState.params

        return <DocumentViewer project={project} revision={revision} document={document}/>

    }
}


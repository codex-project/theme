import * as React from 'react';
import { app, hot, HtmlComponents, lazyInject, RouteState, Store } from '@codex/core';
import { Api } from '@codex/api';
import PropTypes from 'prop-types';
import { BrowserRouter, RouteComponentProps } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Helmet from 'react-helmet';

const log = require('debug')('pages:DocumentPage');

export interface DocumentPageProps extends React.HTMLAttributes<HTMLDivElement> {
    routeState: RouteState
    document: any
}

@hot(module)
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
            router    : app.get<BrowserRouter>('router'),
            document  : toJS(this.store.document),
            attributes: toJS(this.store.document),
        };
    }

    render() {
        const { children, document, routeState, history, staticContext, location, match, ...props } = this.props;

        const content = this.hc.parse(document.content);

        log('render', document.key, { document, props });
        return (
            <div id="document" {...props}>
                <Helmet>
                    <title>{document.title || document.key}</title>
                </Helmet>
                {content}
            </div>
        );
    }
}

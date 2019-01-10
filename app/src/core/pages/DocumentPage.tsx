import * as React from 'react';
import { hot } from '../decorators';
import { Api } from '@codex/api';
import { app, lazyInject } from '../ioc';
import { Document } from '../components/documents';
import { Store } from '../stores';
import posed from 'react-pose';
import { HtmlComponents } from 'classes/HtmlComponents';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Helmet from 'react-helmet';

const log = require('debug')('pages:home');

export interface DocumentPageProps {
    document: any
}


const Container = posed.div({
    enter: { staggerChildren: 50 },
});

const P = posed(Document)({
    enter: { x: 0, opacity: 1 },
    exit : { x: 50, opacity: 0 },
});

@hot(module)
@observer
export default class DocumentPage extends React.Component<DocumentPageProps> {
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
        const {  document } = this.props;
        const content                         = this.hc.parse(document.content);
        return (
            <div id="document">
                <Helmet>
                    <title>{document.title || document.key}</title>
                </Helmet>
                {content}
            </div>
        );
    }
}

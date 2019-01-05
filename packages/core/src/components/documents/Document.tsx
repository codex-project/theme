import React from 'react';
import { hot } from '../../decorators';
import { Card } from 'antd';
import { app, lazyInject } from '../../ioc';
import { renderLoading } from '../loading';
import PropTypes from 'prop-types';

import './index.scss';
import { Api } from '@codex/api';
import { observer } from 'mobx-react';
import { getPrism } from '../../utils/get-prism';
import { HtmlComponents } from '../../classes/HtmlComponents';
import { BrowserRouter } from 'react-router-dom';
import { Store } from '../../stores';
import Helmet from 'react-helmet';
import { toJS } from 'mobx';

const { Meta } = Card;

const log = require('debug')('components:document');

export interface DocumentProps {
    project: string
    revision: string
    document: string
    processAttributes?: (attributes: any) => void
    updateTitle?: boolean
}

interface State {
    document: any
}

@hot(module)
@observer
export class Document extends React.Component<DocumentProps, State> {
    @lazyInject('api') api: Api;
    @lazyInject('components') hc: HtmlComponents;
    @lazyInject('store') store: Store;

    static displayName                          = 'Document';
    static defaultProps: Partial<DocumentProps> = {
        processAttributes: () => null,
        updateTitle      : false,
    };

    static childContextTypes = {
        router    : PropTypes.object.isRequired,
        document  : PropTypes.object,
        attributes: PropTypes.object,
    };

    getChildContext() {
        return {
            router    : app.get<BrowserRouter>(BrowserRouter),
            document  : toJS(this.store.document),
            attributes: toJS(this.store.document),
        };
    }

    public componentDidMount() {
        this.load();
    }

    public componentDidUpdate(prevProps: Readonly<DocumentProps>, prevState: Readonly<State>, snapshot?: any): void {
        let projectChanged  = this.props.project !== prevProps.project;
        let revisionChanged = this.props.revision !== prevProps.revision;
        let documentChanged = this.props.document !== prevProps.document;
        if ( prevProps && prevState && (projectChanged || revisionChanged || documentChanged) ) {
            this.load();
        }
    }

    async load() {
        await this.store.fetchDocument(this.props.project, this.props.revision, this.props.document);
        await getPrism();
    }

    render() {
        if ( ! this.store.document || ! this.store.document.content || this.store.fetching ) return renderLoading();
        const content = this.hc.parse(this.store.document.content);

        if ( this.props.updateTitle ) {
            return (
                <div id="document">
                    <Helmet>
                        <title>{this.store.document.title || this.props.document}</title>
                    </Helmet>
                    {content}
                </div>
            );
        }
        return <div id="document">{content}</div>;
    }
}

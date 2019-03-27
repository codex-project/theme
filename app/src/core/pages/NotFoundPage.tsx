import React from 'react';
import { State } from '../router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import './not-found-page.scss'

const log = require('debug')('pages:error');

export interface NotFoundPageProps {
    title?: React.ReactNode
    message?: React.ReactNode
    routeState?: State
}

export class NotFoundPage extends React.Component<NotFoundPageProps> {
    static displayName                              = 'NotFoundPage';
    static defaultProps: Partial<NotFoundPageProps> = {
        title  : 'Page not found',
        message: 'The requested page does not exist.',
    };
    @lazyInject('store') store: Store;

    render() {
        log('render', { props: this.props }, this);
        let { title, message } = this.props;

        return (
            <div className="not-found-page">
                <h2 className="not-found-page-title">{title}</h2>
                <p className="not-found-page-message">{message}</p>
            </div>
        );
    }

    static build(message: string) {
        return React.createElement(this, { message });
    }

    static project(project) {
        return this.build(`Project "${project}" does not exist.`);
    }

    static revision(revision) {
        return this.build(`Revision "${revision}" does not exist.`);
    }

    static document(document) {
        return this.build(`Document "${document}" does not exist.`);
    }
}

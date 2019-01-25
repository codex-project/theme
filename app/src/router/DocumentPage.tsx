import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { RouteState } from './routes';

const log = require('debug')('router:DocumentPage');

export interface DocumentPageProps {
    routeState: RouteState
    document: any
}

export class DocumentPage extends Component<DocumentPageProps & RouteComponentProps> {
    static displayName                              = 'DocumentPage';
    static defaultProps: Partial<DocumentPageProps> = {};

    render() {
        const { children, document, ...props } = this.props;
        log('render', this);
        return (
            <div>
                <h2>DocumentPage</h2>
                <h3>{document.title}</h3>
                <p>document:{document.key}</p>
            </div>
        );
    }
}

export default DocumentPage;

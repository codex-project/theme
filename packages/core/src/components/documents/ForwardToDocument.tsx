import { Redirect, RedirectProps, RouteComponentProps } from 'react-router';
import { lazyInject } from '../../ioc';
import { Store } from '../../stores';
import React from 'react';
import { Omit } from '../../interfaces';

const log = require('debug')('components:forwardtodocument');


export interface ForwardToDocumentParams {
    project?: string
    revision?: string
    document?: string
}

export interface ForwardToDocumentProps extends RouteComponentProps<ForwardToDocumentParams> {
    redirect: Partial<Omit<RedirectProps, 'to'>>

}

export class ForwardToDocument extends React.PureComponent<ForwardToDocumentProps> {
    @lazyInject('store') store: Store
    static displayName                                                         = 'ForwardToDocument'
    static defaultProps: Partial<ForwardToDocumentProps>                       = {
        redirect: {
            push : true,
            exact: true
        }
    }
    state: { params: { project: string, revision: string, document: string } } = { params: null }

    getRedirectParams() {
        let { location, history, staticContext, match, redirect, children } = this.props
        let params                                                          = match.params || {};
        let projectKey                                                      = params.project || this.store.codex.default_project
        if ( ! this.store.hasProject(projectKey) ) {
            projectKey = this.store.codex.default_project
            log(`Project [${projectKey}] not found`);
        }
        let project     = this.store.getProject(projectKey)
        let revisionKey = params.revision || project.default_revision
        if ( ! this.store.hasRevision(projectKey, params.revision) ) {
            revisionKey = project.default_revision
            log(`Revision [${revisionKey}] for project [${projectKey}] not found`);
        }
        let document = params.document || this.store.getRevision(projectKey, revisionKey).default_document

        params = { project: project.key, revision: revisionKey, document }
        log('Forward getRedirectParams', { params })
        return params;
    }

    componentDidMount() {
        this.setState({ params: this.getRedirectParams() })
    }

    render() {
        if ( ! this.state.params ) return null;
        let { location, history, staticContext, match, redirect, children } = this.props
        let { project, revision, document }                                 = this.state.params
        let to                                                              = `/documentation/${project}/${revision}/${document}`

        log('Forward render', { state: this.state, location:history.location })
        if ( history.location.pathname === to ) return null;
        return (
            <Redirect to={to} {...redirect || {}}/>
        )
    }
}

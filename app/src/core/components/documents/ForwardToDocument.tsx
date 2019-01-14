import { Redirect, RedirectProps, RouteComponentProps } from 'react-router';
import { lazyInject } from '../../ioc';
import { Store } from '../../stores';
import React from 'react';
import { Omit } from '../../interfaces';
import { documentation } from 'utils/url';
import { hot } from 'decorators';
import ErrorPage from 'pages/ErrorPage';

const log = require('debug')('components:forwardtodocument');


export interface ForwardToDocumentParams {
    project?: string
    revision?: string
    document?: string
}

export interface ForwardToDocumentProps extends RouteComponentProps<ForwardToDocumentParams> {
    redirect: Partial<Omit<RedirectProps, 'to'>>

}

interface State {
    params: { project?: string, revision?: string, document?: string },
    error?: Error
}

@hot(module)
export class ForwardToDocument extends React.PureComponent<ForwardToDocumentProps> {
    @lazyInject('store') store: Store;
    static displayName                                   = 'ForwardToDocument';
    static defaultProps: Partial<ForwardToDocumentProps> = {
        redirect: {
            push : true,
            exact: true,
        },
    };
    state: State                                         = { params: null };

    getRedirectParams() {
        let { location, history, staticContext, match, redirect, children } = this.props;
        let params                                                          = match.params || {};
        return this.store.getDocumentParams(params.project, params.revision, params.document);
    }

    componentDidMount() {
        try {
            this.setState({ params: this.getRedirectParams() });
        } catch ( error ) {
            this.setState({ error });
        }
    }

    render() {
        if ( this.state && this.state.params ) {
            return this.renderRedirect();
        }
        if ( this.state && this.state.error ) {
            return this.renderError();
        }
        return null;
    }

    renderError() {
        if ( ! this.state.error ) return null;
        return (
            <ErrorPage error={this.state.error}/>
        );
    }

    renderRedirect() {
        if ( ! this.state.params ) return null;
        let { location, history, staticContext, match, redirect, children } = this.props;
        let { project, revision, document }                                 = this.state.params;
        let to                                                              = documentation(`${project}/${revision}/${document}`);

        log('Forward render', { state: this.state, location: history.location });
        if ( history.location.pathname === to ) return null;
        return (
            <Redirect to={to} {...redirect || {}}/>
        );
    }
}

import React from 'react';
import { lazyInject, RouteState, Store } from '@codex/core';
import { api, Api } from '@codex/api';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { hot } from 'react-hot-loader';

const log = require('debug')('pages:auth');

export interface AuthPageProps {
    revision?: api.Revision
}


@observer
class AuthPage extends React.Component<AuthPageProps & { routeState: RouteState } & RouteComponentProps> {
    static displayName = 'AuthPage';

    @lazyInject('api') api: Api;
    @lazyInject('store') store: Store;

    render() {
        const { revision, ...props } = this.props;

        return (
            <div id="auth" {...props}>
                <h3>AuthPage Test Page</h3>
            </div>
        );
    }

}

export default hot(module)(AuthPage) as typeof AuthPage;

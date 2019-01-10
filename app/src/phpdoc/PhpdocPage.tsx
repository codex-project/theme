import * as React from 'react';
import { hot, lazyInject, Store } from '@codex/core';
import { Api } from '@codex/api';

const log = require('debug')('pages:home');

export interface PhpdocPageProps {
    project: string
    revision: string
}


@hot(module)
export default class PhpdocPage extends React.Component<PhpdocPageProps> {
    @lazyInject('api') api: Api;
    @lazyInject('store') store: Store;

    static displayName = 'PhpdocPage';

    render() {
        const { project, revision } = this.props;
        return (
            <div>
                phpdoc
            </div>
        );
    }
}

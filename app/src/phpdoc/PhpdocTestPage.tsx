import React from 'react';
import { lazyInject, RouteState } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocManifest, PhpdocStore } from './logic';
import InspireTree from 'inspire-tree';
import { RouteComponentProps } from 'react-router';
import { PhpdocManifestProvider } from './components/providers';
import { observer } from 'mobx-react';
import PhpdocMethod from './components/method';

const log = require('debug')('pages:phpdoc');

export interface PhpdocTestPageProps {
    revision?: api.Revision
}

@observer
export default class PhpdocTestPage extends React.Component<PhpdocTestPageProps & { routeState: RouteState } & RouteComponentProps> {
    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;

    static displayName = 'PhpdocTestPage';

    state: { manifest: PhpdocManifest, tree: InspireTree } = { manifest: null, tree: null };


    render() {
        const { revision, ...props } = this.props;

        return (
            <div id="phpdoc" {...props}>
                <PhpdocManifestProvider project="codex" revision="master">
                    <PhpdocMethod.Signature fqns="\Codex\Codex::get()"/>
                    <PhpdocMethod fqns="\Codex\Codex::get()"/>
                </PhpdocManifestProvider>
            </div>
        );
    }
}

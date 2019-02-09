import React from 'react';
import { lazyInject, RouteState, Store } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocStore } from './logic';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { Tabs } from 'antd';
import { action, observable } from 'mobx';
import { hot } from 'react-hot-loader';
import { ManifestProvider } from './components/base';
import PhpdocMemberList from './components/member-list';
import { PhpdocMethodSignature } from './components/method';

const { TabPane: Tab } = Tabs;
const log              = require('debug')('pages:phpdoc');

export interface PhpdocTestPageProps {
    revision?: api.Revision
}


@observer
class PhpdocTestPage extends React.Component<PhpdocTestPageProps & { routeState: RouteState } & RouteComponentProps> {
    static displayName = 'PhpdocTestPage';

    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;
    @lazyInject('store') store: Store;

    @observable fqsen = '\\Codex\\Codex::get()';

    @action setFQNS(fqsen) {this.fqsen = fqsen;}

    render() {
        const { revision, ...props } = this.props;

        return (
            <div id="phpdoc" {...props}>
                <h3>PHPDOC Test Page</h3>
                <ManifestProvider project="codex" revision="master">
                    {/*<PhpdocMemberList fqsen={this.fqsen}/>*/}
                    <PhpdocMethodSignature fqsen={this.fqsen}/>
                </ManifestProvider>
            </div>
        );
    }

}

export default hot(module)(PhpdocTestPage) as typeof PhpdocTestPage;

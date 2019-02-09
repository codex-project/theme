import React from 'react';
import { lazyInject, RouteState, Store } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocManifest, PhpdocStore } from './logic';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { Tabs } from 'antd';
import InspireTree from 'inspire-tree';
import PhpdocTree, { TreeBuilder } from './components/tree';
import { action, observable } from 'mobx';
import { hot } from 'react-hot-loader';
import { ManifestProvider } from './components/base';
import PhpdocMemberList from './components/member-list';

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
    @observable show  = false;

    @action setFQNS(fqsen) {this.fqsen = fqsen;}

    @action setShow(show: boolean) {this.show = show;}

    render() {
        const { revision, ...props } = this.props;

        return (
            <div id="phpdoc" {...props}>
                <h3>PHPDOC Test Page</h3>
                <If condition={! this.show}>
                    <a onClick={e => this.setShow(true)}>Show</a>
                </If>
                <ManifestProvider project="codex" revision="master">
                    <If condition={this.show}>
                        <PhpdocMemberList fqsen={this.fqsen}/>
                    </If>
                </ManifestProvider>
            </div>
        );
    }

    @action setTree(tree: InspireTree) {this.tree = tree;}


    @observable tree: InspireTree = new InspireTree({});

    renderTree(manifest: PhpdocManifest) {
        if ( ! this.tree || this.tree.nodes().length === 0 ) {
            let builder = new TreeBuilder(manifest.files.keyBy('name'), {});
            this.setTree(builder.build());

        }

        return (
            <PhpdocTree
                searchable
                tree={this.tree}
                style={{ height: 300 }}
                onNodeClick={node => this.setFQNS(node.fullName)}

            />
        );
    }
}

export default hot(module)(PhpdocTestPage) as typeof PhpdocTestPage;

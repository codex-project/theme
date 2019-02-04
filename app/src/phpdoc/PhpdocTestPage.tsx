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
import PhpdocApp from './components/app';

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

    @observable fqns = '\\Codex\\Codex';

    @action setFQNS(fqns) {this.fqns = fqns;}

    render() {
        const { revision, ...props } = this.props;

        return (
            <div id="phpdoc" {...props}>
                <h3>PHPDOC Test Page</h3>
                <PhpdocApp project="codex" revision="master" fqns={this.fqns}/>
                {/*<PhpdocManifestProvider project="codex" revision="master">
                <PhpdocMethod.Signature fqns="\Codex\Codex::get()"/>
                    <PhpdocMethod fqns="\Codex\Codex::get()"/>
                    <Row>
                        <Col span={6}>
                            <PhpdocManifestProvider.Context.Consumer>
                                {context => context.manifest ? this.renderTree(context.manifest) : null}
                            </PhpdocManifestProvider.Context.Consumer>
                        </Col>
                        <Col>
                            <Tabs>
                                <Tab key="entity" tab="Phpdoc Entity">
                                    <PhpdocEntity fqns={this.fqns}/>
                                </Tab>
                                <Tab key="method-signature" tab="Phpdoc Method Signature">
                                    <PhpdocMethodSignature fqns="\\Codex\\Codex::get()" hide={{
                                        namespace: true,
                                    }}/>
                                </Tab>
                                <Tab key="docblock" tab="Phpdoc Docblock">
                                    <PhpdocFileProvider fqns={this.fqns}>
                                        <PhpdocFileProvider.Context.Consumer>
                                            {context => context.file ? (
                                                <Fragment>
                                                    <If condition={context.file.docblock}>
                                                        <PhpdocDocblock
                                                            key="docblock-docblock"
                                                            docblock={context.file.docblock}
                                                        />
                                                    </If>
                                                    <If condition={context.file.entity.methods}>
                                                        <Tabs
                                                            key="docblock-tabs"
                                                            tabPosition="left"
                                                            style={{ height: 500 }}
                                                            size="small"
                                                        >
                                                            {context.file.entity.methods.filter(method => ! ! method.docblock).map((method, i) => {
                                                                return (
                                                                    <Tab
                                                                        key={method.full_name + '.' + i}
                                                                        tab={method.name}
                                                                        // style={{ height: 200 }}
                                                                    >
                                                                        <PhpdocDocblock
                                                                            key={method.full_name + '.' + i}
                                                                            docblock={method.docblock}
                                                                            withoutTags={[]}
                                                                        />
                                                                    </Tab>
                                                                );
                                                            })}
                                                        </Tabs>
                                                    </If>
                                                </Fragment>
                                            ) : null}
                                        </PhpdocFileProvider.Context.Consumer>
                                    </PhpdocFileProvider>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </PhpdocManifestProvider>*/}
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

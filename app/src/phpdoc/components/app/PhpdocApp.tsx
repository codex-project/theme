import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { hot, lazyInject, Store } from '@codex/core';
import { PhpdocFileProvider, PhpdocFileProviderProps, PhpdocManifestProvider, PhpdocManifestProviderBaseProps, withPhpdocFile, withPhpdocManifest } from '../providers';
import { Api } from '@codex/api';
import { PhpdocManifest, PhpdocStore } from '../../logic';
import { action, observable } from 'mobx';
import InspireTree from 'inspire-tree';
import { Col, Row } from 'antd/lib/grid';
import { Tabs } from 'antd';

import {PhpdocTree, TreeBuilder } from '../tree';
import PhpdocEntity from '../entity';
import PhpdocMethod from '../method';
import PhpdocDocblock from '../docblock';

import './app.scss'

export interface PhpdocAppProps extends PhpdocFileProviderProps, PhpdocManifestProviderBaseProps {}

const Tab = Tabs.TabPane;

@hot(module)
@withPhpdocManifest(true,true)
@withPhpdocFile()
@observer
export class PhpdocApp extends Component<PhpdocAppProps> {
    static displayName                           = 'PhpdocApp';
    static defaultProps: Partial<PhpdocAppProps> = {};
    static contextType                           = PhpdocFileProvider.Context.Context;
    context!: React.ContextType<typeof PhpdocFileProvider.Context>;

    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;
    @lazyInject('store') store: Store;

    @observable fqns = '\\Codex\\Codex';

    @action setFQNS(fqns) {this.fqns = fqns;}

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

    render() {
        const {  ...props } = this.props;

        return (
            <div id="phpdoc-app" className="phpdoc-app" {...props}>
                {/*<PhpdocMethod.Signature fqns="\Codex\Codex::get()"/>*/}
                {/*<PhpdocMethod fqns="\Codex\Codex::get()"/>*/}
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
                                <PhpdocMethod.Signature fqns="\\Codex\\Codex::get()" hide={{
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
            </div>
        );
    }
}

export default PhpdocApp;

import React, { Fragment } from 'react';
import { dialog, lazyInject, RouteState, Store } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocManifest, PhpdocStore } from './logic';
import { RouteComponentProps } from 'react-router';
import { Observer, observer } from 'mobx-react';
import { Tabs } from 'antd';
import { action, observable } from 'mobx';
import { hot } from 'react-hot-loader';
import { ManifestCtx, ManifestProvider } from './components/base';
import PhpdocMemberList from './components/member-list';
import { Col, Row } from 'antd/es/grid';
import PhpdocTree from './components/tree';
import { default as PhpdocTreeClass } from './components/tree/PhpdocTree';
import PhpdocEntity from './components/entity';
import { InspireTree } from './components/tree/InspireTree';


const { TabPane: Tab } = Tabs;
const log              = require('debug')('pages:phpdoc');

export interface PhpdocTestPageProps {
    revision?: api.Revision
}

@hot(module)
@observer
export default class PhpdocTestPage extends React.Component<PhpdocTestPageProps & { routeState: RouteState } & RouteComponentProps> {
    static displayName = 'PhpdocTestPage';

    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;
    @lazyInject('store') store: Store;

    @observable fqsen = '\\Codex\\Codex::get()';
    tree: InspireTree;
    manifest: PhpdocManifest;
    treeRef           = React.createRef<PhpdocTreeClass>();
    setTree           = (tree: InspireTree) => {
        this.tree = tree;
        this.init();
    };
    devDialog: { remove(): any; };

    @action setFQNS(fqsen) {this.fqsen = fqsen;}

    inited = false;

    // public componentDidMount(): void {
    //
    //     this.devDialog = dialog.bindToKey('d', {
    //         type : 'button',
    //         props: {
    //             children: 'asf',
    //             onClick : () => {
    //             },
    //         },
    //     });
    // }
    //
    // public componentWillUnmount(): void {
    //     if ( this.devDialog ) {
    //         this.devDialog.remove();
    //         this.devDialog = null;
    //     }
    // }

    public init(): void {
        if ( ! this.tree || this.inited ) return;
        log('init');
        this.inited = true;
        this.tree.fqsenNode(this.fqsen).select();
        this.tree.collapseDeep();
        this.tree.selected().expandParents();
    }

    render() {
        window[ 'phpdocpage' ]                                                                      = this;
        const { revision, routeState, children, match, staticContext, location, history, ...props } = this.props;

        return (
            <div id="phpdoc" {...props}>
                <h3>PHPDOC Test Page</h3>
                <ManifestProvider project="codex" revision="master">
                    <PhpdocEntity fqsen={this.fqsen}/>
                    <Row type="flex">
                        <Col span={6}>
                            <PhpdocTree
                                searchable filterable scrollToSelected
                                style={{ height: 300 }}
                                onNodeClick={node => this.setFQNS(node.fullName)}
                                getTree={this.setTree}
                                ref={this.treeRef}
                            />
                        </Col>
                        <Col span={18}>
                            <PhpdocMemberList
                                searchable filterable selectable
                                fqsen={this.fqsen}
                            />
                        </Col>
                    </Row>
                    <Row type="flex" style={{ background: '#aa2337', height: 10, width: '100%' }}>
                        a
                    </Row>
                </ManifestProvider>
            </div>
        );
    }

    render2() {
        window[ 'phpdocpage' ]       = this;
        const { revision, ...props } = this.props;

        return (
            <div id="phpdoc" {...props}>
                <h3>PHPDOC Test Page</h3>
                <ManifestProvider project="codex" revision="master">
                    <ManifestCtx.Consumer>
                        {ctx => {
                            this.manifest = ctx.manifest;
                            return (
                                <Observer>{() =>
                                    <Fragment>
                                        <Row type="flex">
                                            <PhpdocEntity fqsen={this.fqsen}/>
                                        </Row>
                                        <Row type="flex">
                                            <Col span={6}>
                                                <PhpdocTree
                                                    searchable filterable scrollToSelected
                                                    style={{ height: '100%' }}
                                                    onNodeClick={node => this.setFQNS(node.fullName)}
                                                    getTree={this.setTree}
                                                    ref={this.treeRef}
                                                />
                                            </Col>
                                            <Col span={18}>
                                                <PhpdocMemberList fqsen={this.fqsen} searchable filterable selectable/>
                                            </Col>
                                        </Row>
                                    </Fragment>
                                }</Observer>
                            );
                        }}
                    </ManifestCtx.Consumer>
                </ManifestProvider>
            </div>
        );
    }

}



import React from 'react';
import { Button, lazyInject, RouteState, Scrollbar, Store, Toolbar } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocStore } from './logic';
import { RouteComponentProps } from 'react-router';
import { Observer, observer } from 'mobx-react';
import { Tabs } from 'antd';
import { action, computed, observable, runInAction } from 'mobx';
import { hot } from 'react-hot-loader';
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';

import './styling/vendor/react-mosaic-component/index.scss';
import './phpdoc-mosaic.scss';
import { PhpdocTree } from './components/tree';
import { PhpdocManifestProvider } from './components/providers';
import { classes } from 'typestyle';
import PhpdocMethod from './components/method';
import PhpdocEntity from './components/entity';

const { TabPane: Tab } = Tabs;
const log              = require('debug')('pages:phpdoc');

export interface PhpdocMosaicTestPageProps {
    revision?: api.Revision
}

export type ViewId = 'tree' | 'entity' | 'memberList' | 'method' | 'code';


@observer
class PhpdocMosaicTestPage extends React.Component<PhpdocMosaicTestPageProps & { routeState: RouteState } & RouteComponentProps> {
    static displayName = 'PhpdocMosaicTestPage';

    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;
    @lazyInject('store') store: Store;

    @observable fqns = '\\Codex\\Codex::get()';

    @action setFQNS(fqns) {this.fqns = fqns;}

    public componentWillMount(): void {
        const { layout } = this.store;
        layout.content.set('padding', 0);
        layout.content.set('margin', 0);
        layout.left.setShow(false);
    }

    renderTree() {
        return (
            <PhpdocTree
                searchable
                style={{ height: '100%' }}
                onNodeClick={node => this.setFQNS(node.fullName)}

            />
        );
    }

    renderEntity() {
        return (
            <PhpdocEntity fqns={this.fqns}>Method</PhpdocEntity>
        );
    }

    renderMemberList() {
        return (
            <div>MemberList</div>
        );
    }

    renderMethod() {
        return (
            <Scrollbar>
                <PhpdocMethod fqns={this.fqns} signatureProps={{ size: 12 }}>Method</PhpdocMethod>
            </Scrollbar>
        );
    }

    renderCode() {
        return (
            <div>CodeView</div>
        );
    }


    @observable mosaicValue: MosaicNode<ViewId> = {
        direction      : 'row',
        splitPercentage: 15,
        first          : 'tree',
        second         : {
            direction      : 'row',
            splitPercentage: 35,
            first          : {
                direction      : 'column',
                splitPercentage: 70,
                first          : {
                    direction      : 'column',
                    splitPercentage: 15,
                    first          : 'entity',
                    second         : 'memberList',
                },
                second         : 'code',
            },
            second         : 'method',
        },
    };

    @observable resizeLock: boolean = true;
    @observable dragLock: boolean   = true;

    @computed get windowClassName() {
        let classNames = [
            this.dragLock && 'mosaic-window-hide-title',
        ].filter(Boolean);
        return classes(...classNames);
    }

    @action toggleResizeLock() {this.resizeLock = ! this.resizeLock;}

    @action toggleDragLock() {this.dragLock = ! this.dragLock;}

    onMosaicChange = (value: MosaicNode<ViewId> | null) => {
        log('onMosaicChange', value);
        runInAction(() => {this.mosaicValue = value;});
    };

    render() {
        const { revision, ...props }                       = this.props;
        const CONTENT_MAP: Record<ViewId, React.ReactNode> = {
            tree      : this.renderTree(),
            entity    : this.renderEntity(),
            memberList: this.renderMemberList(),
            method    : this.renderMethod(),
            code      : this.renderCode(),
        };
        return (
            <PhpdocManifestProvider project="codex" revision="master">
                <div key="phpdoc-mosaic" id="phpdoc-mosaic" className="phpdoc-mosaic" {...props}>
                    <Toolbar.Item side="right">
                        <Observer>{() =>
                            <Button.Group>
                                <Button borderless type="toolbar" icon={this.dragLock ? 'lock' : 'unlock'} onClick={() => this.toggleDragLock()}>Position</Button>
                                <Button borderless type="toolbar" icon={this.resizeLock ? 'lock' : 'unlock'} onClick={() => this.toggleResizeLock()}>Size</Button>
                            </Button.Group>
                        }</Observer>
                    </Toolbar.Item>
                    <Mosaic<ViewId>
                        className="mosaic-codex-theme"
                        resize={this.resizeLock ? 'DISABLED' : { minimumPaneSizePercentage: 15 }}
                        value={this.mosaicValue}
                        onChange={this.onMosaicChange}
                        renderTile={(id, path) => (
                            <Observer>{() =>
                                <MosaicWindow<ViewId>
                                    className={classes(this.windowClassName, 'mosaic-window-' + id)}
                                    draggable={! this.dragLock}
                                    path={path}
                                    toolbarControls={[ <div key="null"/> ]}
                                    createNode={() => 'method'}
                                    title=""
                                >
                                    {CONTENT_MAP[ id ]}
                                </MosaicWindow>}
                            </Observer>
                        )}

                    />
                </div>
            </PhpdocManifestProvider>
        );
    }

}

export default hot(module)(PhpdocMosaicTestPage) as typeof PhpdocMosaicTestPage;

import React, { Fragment } from 'react';
import memo from 'memoize-one';
import { Button, CodeHighlight, lazyInject, RouteState, Scrollbar, Store, Toolbar } from '@codex/core';
import { api, Api } from '@codex/api';
import { FQSEN, PhpdocFile, PhpdocStore } from './logic';
import { RouteComponentProps } from 'react-router';
import { Observer, observer } from 'mobx-react';
import { Tabs } from 'antd';
import { action, computed, observable } from 'mobx';
import { hot } from 'react-hot-loader';
import { Mosaic, MosaicNode, MosaicWindow } from 'react-mosaic-component';

import './styling/vendor/react-mosaic-component/index.scss';
import './phpdoc-mosaic.scss';
import { PhpdocTree } from './components/tree';
import { classes } from 'typestyle';
import PhpdocMethod from './components/method';
import PhpdocEntity from './components/entity';
import PhpdocMemberList from './components/member-list';
import { debounce } from 'lodash-decorators';
import { ManifestProvider } from './components/base';
import { InspireTree } from './components/tree/InspireTree';
import PhpdocDocblock from './components/docblock';

const { TabPane: Tab } = Tabs;
const log              = require('debug')('pages:phpdoc');

export interface PhpdocMosaicTestPageProps {
    revision?: api.Revision
}

export type ViewId = 'tree' | 'entity' | 'code';

const Method = memo(props => <PhpdocMethod fqsen={props.fqsen} signatureProps={{ size: 12 }}/>);
const Win    = memo(props =>
    <MosaicWindow<ViewId>
        className={classes(props.className, 'mosaic-window-' + props.id)}
        draggable={! props.dragLock}
        path={props.path}
        toolbarControls={[ <div key="null"/> ]}
        createNode={() => 'entity'}
        title=""
    >
        {props.map[ props.id ]}
    </MosaicWindow>);


@observer
class PhpdocMosaicTestPage extends React.Component<PhpdocMosaicTestPageProps & { routeState: RouteState } & RouteComponentProps> {
    static displayName = 'PhpdocMosaicTestPage';

    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;
    @lazyInject('store') store: Store;

    @observable _fqsen               = '\\Codex\\Codex::get()';
    @observable file: PhpdocFile     = null;
    @observable entityHeight: number = null;
    @observable showMemberList       = false;

    @action setFQNS(fqsen) {this._fqsen = fqsen;}

    @computed get fqsen(): FQSEN {return FQSEN.from(this._fqsen);}

    entityTop: HTMLElement;
    codeRef: CodeHighlight;

    public componentWillMount(): void {
        const { layout } = this.store;
        layout.content.set('padding', 0);
        layout.content.set('margin', 0);
        layout.left.setShow(false);
    }

    renderTree() {
        return (
            <PhpdocTree
                searchable filterable scrollToSelected
                style={{ height: '100%' }}
                onNodeClick={node => this.setFQNS(node.fullName)}
                getTree={(tree: InspireTree) => tree.manifest().fetchFile(this.fqsen.slashEntityName).then(file => this.file = file)}
            />
        );
    }

    renderEntity() {
        return (
            <Fragment>
                <div ref={ref => {
                    if ( ref && ! this.entityTop ) {
                        this.entityTop = ref;
                    }
                    this.entityHeight = this.entityTop.getBoundingClientRect().height;
                }}>
                    <PhpdocEntity fqsen={this.fqsen}/>
                    <If condition={this.file}>
                        <PhpdocDocblock docblock={this.file.entity.docblock}/>
                    </If>
                </div>
                <If condition={this.entityHeight}>
                    <If condition={! this.showMemberList}>
                        <Button onClick={e => this.showMemberList = true}>show</Button>
                    </If>
                    <If condition={this.showMemberList}>
                        <PhpdocMemberList
                            height={`calc(100% - ${this.entityHeight}px`}
                            fqsen={this.fqsen}
                            selectable
                            searchable
                            filterable
                        />
                    </If>
                </If>
            </Fragment>
        );
    }

    renderCode() {
        if ( ! this.file || ! this.file.source ) return null;
        return (
            <Scrollbar style={{ height: '100%' }}>
                <CodeHighlight
                    withLineNumbers
                    ref={ref => this.codeRef = ref}
                    code={this.file.source}
                    language="php"
                    preClassName="no-border"
                />
            </Scrollbar>
        );
    }


    mosaicValue: MosaicNode<ViewId> = {
        direction      : 'row',
        splitPercentage: 15,
        first          : 'tree',
        second         : {
            direction      : 'column',
            splitPercentage: 70,
            first          : 'entity',
            second         : 'code',
        },
    };

    @observable resizeLock: boolean = false;
    @observable dragLock: boolean   = true;

    @computed get windowClassName() {
        let classNames = [
            this.dragLock && 'mosaic-window-hide-title',
        ].filter(Boolean);
        return classes(...classNames);
    }

    @action toggleResizeLock() {this.resizeLock = ! this.resizeLock;}

    @action toggleDragLock() {this.dragLock = ! this.dragLock;}

    @debounce(250, { trailing: true })
    onMosaicChange(value: MosaicNode<ViewId> | null) {
        log('onMosaicChange', value);
        // runInAction(() => {this.mosaicValue = value;});
    };

    renderTile = (id, path, children) => {
        return (<Observer>{() =>
                <MosaicWindow<ViewId>
                    className={classes(this.windowClassName, 'mosaic-window-' + id)}
                    draggable={! this.dragLock}
                    path={path}
                    toolbarControls={[ <div key="null"/> ]}
                    createNode={() => 'entity'}
                    title=""
                >
                    {children}
                </MosaicWindow>}</Observer>
        );
    };


    CONTENT_MAP: Record<ViewId, (path) => React.ReactElement<any>> = {
        tree  : memo(path => this.renderTile('tree', path, <Observer>{() => this.renderTree()}</Observer>)),
        entity: memo(path => this.renderTile('entity', path, <Observer>{() => this.renderEntity()}</Observer>)),
        code  : memo(path => this.renderTile('code', path, <Observer>{() => this.renderCode()}</Observer>)),
    };

    render() {
        window[ 'phpdocmosaic' ]                                                                    = this;
        const { children, revision, history, location, staticContext, match, routeState, ...props } = this.props;

        return (
            <ManifestProvider project="codex" revision="master">
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
                        initialValue={this.mosaicValue}
                        onChange={e => this.onMosaicChange(e)}
                        renderTile={(id, path) => this.CONTENT_MAP[ id ](path)}
                    />
                </div>
            </ManifestProvider>
        );
    }

}

export default hot(module)(PhpdocMosaicTestPage);

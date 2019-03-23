import React from 'react';
import { LayoutStore, lazyInject, State } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocStore } from './logic/PhpdocStore';
import { TreeBuilder } from './components/tree';
import { ManifestProvider } from './components/base';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PhpdocMethod } from './components';
import { observable } from 'mobx';
import { FQSEN } from './logic';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';

const AutoWidthGridLayout = WidthProvider(ReactGridLayout);

const log = require('debug')('pages:phpdoc');

export interface PhpdocPageProps {
    revision?: api.Revision
}


@hot(module)
@observer
export default class PhpdocPage extends React.Component<PhpdocPageProps & { routeState: State }> {
    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;
    @lazyInject('store.layout') layout: LayoutStore;

    static displayName = 'PhpdocPage';

    @observable fqsen: FQSEN = new FQSEN('Codex\\Codex::get()');

    async load() {
        this.setState({ manifest: null, file: null, tree: null });
        let manifest = await this.phpdoc.fetchManifest('codex', 'master');
        let file     = await manifest.fetchFile('Codex\\Codex');
        let builder  = new TreeBuilder(manifest.files.keyBy('name'), {});
        let tree     = builder.build();
        this.setState({ manifest, file, tree });
        return { manifest, file };
    }

    public componentDidMount(): void {
        this.layout.left.setCollapsed(true);
        this.layout.right.setShow(false);
        this.layout.header.setShow(false);
        this.layout.footer.setShow(false);

    }

    render() {
        window[ 'phpdoc' ]           = this;
        const { children, ...props } = this.props;
        let layout                   = [
            { i: 'a', x: 0, y: 0, w: 1, h: 2 },
            { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
            { i: 'c', x: 4, y: 0, w: 1, h: 2 },
        ];
        return (
            <div id="phpdoc-page">
                <ManifestProvider project="codex" revision="master">
                    <AutoWidthGridLayout layout={layout} cols={12} rows={12} rowHeight={30}>
                        <div key="a"><PhpdocMethod fqsen={this.fqsen}/></div>
                        <div key="b">b</div>
                        <div key="c">c</div>
                    </AutoWidthGridLayout>
                </ManifestProvider>
            </div>
        );
    }

    state = {
        widgets: {
            // WordCounter: {
            //     type: CounterWidget,
            //     title: 'Counter widget',
            // }
        },
        layout : {
            rows: [ {
                columns: [ {
                    className: 'col-md-12',
                    widgets  : [ { key: 'WordCounter' } ],
                } ],
            } ],
        },
    };

}

import React from 'react';
import { LayoutStore, lazyInject, State } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocStore } from './logic/PhpdocStore';
import { ManifestContext } from './components/base';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { observable } from 'mobx';
import { FQSEN } from './logic';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import {PhpdocLink} from './components/link';

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

    @observable fqsen: FQSEN = new FQSEN('Codex\\Codex');
    mounted: boolean;

    async load() {
        let manifest = await this.phpdoc.fetchManifest('codex', 'master');
        let file     = await manifest.fetchFile(this.fqsen);
        if ( this.mounted ) {
            this.setState({ manifest, loaded: true });
        }
    }

    state = { manifest: null, loaded: false };

    public componentWillMount(): void {
        this.mounted = true;
        this.load();
    }

    public componentWillUnmount(): void {
        this.mounted = false;
    }

    render() {
        window[ 'phpdoc' ] = this;
        return (
            <div id="phpdoc-page">
                <If condition={this.state && this.state.manifest && this.state.loaded}>
                    <ManifestContext.Provider value={{ manifest: this.state.manifest }}>
                        <PhpdocLink fqsen={this.fqsen} action="drawer">
                            The link
                        </PhpdocLink>
                    </ManifestContext.Provider>
                </If>
            </div>
        );
    }

    renderContent(): React.ReactNode {
        return (
            <PhpdocLink fqsen={this.fqsen} action="drawer">
                The link
            </PhpdocLink>
        );
    }


}

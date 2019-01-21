import React from 'react';
import { lazyInject } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocManifest, PhpdocStore } from './logic/PhpdocStore';
import { PhpdocTree, TreeBuilder } from './components/tree';
import InspireTree from 'inspire-tree';

const log = require('debug')('pages:phpdoc');

export interface PhpdocPageProps {
    revision?: api.Revision
}


export default class PhpdocPage extends React.Component<PhpdocPageProps> {
    @lazyInject('api') api: Api;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;

    static displayName = 'PhpdocPage';

    state: { manifest: PhpdocManifest, tree: InspireTree } = { manifest: null, tree: null };

    async load() {
        this.setState({ manifest: null, file: null, tree: null });
        let manifest = await this.phpdoc.fetchManifest('codex', '2.0.0-alpha');
        let file     = await manifest.fetchFile('Codex\\Codex');
        let builder  = new TreeBuilder(manifest.files.keyBy('name'), {});
        let tree     = builder.build();
        this.setState({ manifest, file, tree });
        return { manifest, file };
    }

    public componentDidMount(): void {
        this.load();
    }


    render() {
        window[ 'phpdoc' ]           = this;
        const { revision, ...props } = this.props;
        log('render', { revision, me: this });
        if ( ! this.state || ! this.state.manifest || ! this.state.tree ) return <div>loading</div>;

        return (
            <div id="phpdoc" {...props}>
                <PhpdocTree
                    searchable
                    tree={this.state.tree}
                    style={{ height: '300px', width: '300px' }}
                />
            </div>
        );
    }
}

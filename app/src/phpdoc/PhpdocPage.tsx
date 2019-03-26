import React from 'react';
import { LayoutStore, lazyInject, State } from '@codex/core';
import { api, Api } from '@codex/api';
import { PhpdocStore } from './logic/PhpdocStore';
import { ManifestContext } from './components/base';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { action, observable } from 'mobx';
import { FQSEN } from './logic';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { PhpdocLink } from './components/link';
import { Col, Row } from 'antd';
import { Members, MembersWithFilterProps } from './components/members';

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

    @observable showLists = false;

    @action setShowLists(showLists: boolean) {
        this.showLists = showLists;
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
        const height       = 300;
        return (
            <div id="phpdoc-page">
                <If condition={this.state && this.state.manifest && this.state.loaded}>
                    <ManifestContext.Provider value={{ manifest: this.state.manifest }}>

                        <PhpdocLink fqsen={this.fqsen} action="drawer">
                            Show Drawer
                        </PhpdocLink>

                        <a href="#" onClick={e => {
                            log('showLists click', e, { thisshowLists: this.showLists });
                            e.preventDefault();
                            this.setShowLists(! this.showLists);
                        }}>Show Lists</a>

                        {/*<PhpdocMemberList
                            fqsen="Codex\\Codex"
                            height={height}
                            filterable searchable selectable
                        />*/}

                        <If condition={this.showLists}>
                            <Row>
                                <Col span={12} offset={6}>
                                    <Members<MembersWithFilterProps>
                                        fqsen={this.fqsen}
                                        filterable selectable searchable
                                        scrollable height={500}

                                        methods={{
                                            hide: {
                                                namespace       : true,
                                                argumentDefaults: true,
                                                typeTooltip     : true,
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                            {/*<Row gutter={10}>
                                <Col span={6}>

                                </Col>
                                <Col span={6}>
                                    <PhpdocMemberList fqsen="Codex\\Projects\\Project" height={height}/>
                                </Col>
                                <Col span={6}>
                                    <PhpdocMemberList fqsen="Codex\\Revisions\\Revision" height={height}/>
                                </Col>
                                <Col span={6}>
                                    <PhpdocMemberList fqsen="Codex\\Documents\\Document" height={height}/>
                                </Col>
                            </Row>*/}
                        </If>
                    </ManifestContext.Provider>
                </If>
            </div>
        );
    }


}

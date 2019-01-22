import React from 'react';
import { hot, lazyInject, Store } from '@codex/core';
import { observer } from 'mobx-react';
import { PhpdocContent, PhpdocDocblock, PhpdocEntity, PhpdocTree, TreeBuilder } from '@codex/phpdoc/components';
import { RouteComponentProps } from 'react-router';
import { Col, Row } from 'antd/lib/grid';
import { Card, Tabs } from 'antd';
import { PhpdocFileComponent } from '@codex/phpdoc/components/PhpdocFileComponent';
import { action, observable } from 'mobx';
import InspireTree from 'inspire-tree';
import { api } from '@codex/api';

const Tab     = Tabs.TabPane;
const CardCol = (props: { title: string, children: any, span?: number }) => <Col span={props.span || 6}><Card size="small" title={props.title} bordered={false}>{props.children}</Card></Col>;

@hot(module)
@observer
export default class DemoPage extends React.Component<{ revision: api.Revision } & RouteComponentProps<any>, {}> {
    @lazyInject('store') store: Store;

    @observable fqns = '\\Codex\\Codex';

    @action setFQNS(fqns) {this.fqns = fqns;}

    @action setTree(tree: InspireTree) {this.tree = tree;}

    @observable tree: InspireTree = new InspireTree({});

    public componentDidMount(): void {
        this.store.mergeLayout(this.props.revision);
    }

    render() {
        window[ 'demo' ]                                       = this;
        const { children, match, location, history, ...props } = this.props;
        const { params }                                       = match;

        return (
            <div {...props}>
                <PhpdocContent project={params.project} revision={params.revision}>
                    <h2>DemoPage</h2>
                    <Row>
                        <Col span={6}>
                            <PhpdocContent.Context.Consumer>
                                {value => {
                                    if ( ! this.tree || this.tree.nodes().length === 0 ) {
                                        let builder = new TreeBuilder(value.manifest.files.keyBy('name'), {});
                                        this.setTree(builder.build());
                                    }
                                    return <PhpdocTree
                                        searchable
                                        tree={this.tree}
                                        style={{ height: 300 }}
                                        onNodeClick={node => this.setFQNS(node.fullName)}
                                    />;
                                }}
                            </PhpdocContent.Context.Consumer>
                        </Col>
                        <Col>
                            <Tabs>
                                <Tab key="entity" tab="Phpdoc Entity">
                                    <PhpdocEntity fqns={this.fqns}/>
                                </Tab>
                                <Tab key="docblock" tab="Phpdoc Docblock">
                                    <PhpdocFileComponent fqns={this.fqns}>
                                        {value => (
                                            <If condition={value && value.docblock}>
                                                <PhpdocDocblock docblock={value.docblock}/>
                                            </If>
                                        )}
                                    </PhpdocFileComponent>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>

                </PhpdocContent>
            </div>
        );
    }
}





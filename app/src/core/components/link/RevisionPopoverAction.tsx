import { observer } from 'mobx-react';
import React from 'react';
import { IDefinedRoute } from 'interfaces';
import { hot } from 'decorators';
import { clink } from 'stores/CLinkStore';
import { lazyInject } from 'ioc';
import { Api } from '@codex/api';
import { Routes } from 'collections/Routes';
import { Store } from 'stores';
import { PopoverAction } from 'components/link/PopoverAction';
import { Card, List } from 'antd';
import { Scrollbar } from 'components/scrollbar';
import { Link } from 'react-router-dom';


export interface RevisionPopoverActionProps {
    link: React.ReactNode
    route: IDefinedRoute
    to: string
}

@hot(module)
@observer
@clink.action('revision', 'popover')
export class RevisionPopoverAction extends React.Component<RevisionPopoverActionProps> {
    @lazyInject('api') api: Api;
    @lazyInject('routes') routes: Routes;
    @lazyInject('store') store: Store;

    render() {
        let { project, revision } = this.routes.getRouteParams(this.props.route, this.props.to); //getRouteParams(this.props.route, this.props.to);
        let query                 = `{
revision(projectKey: "${project}", revisionKey: "${revision}"){
    key
}
}`;
        return (
            <PopoverAction
                loader={async () => (await this.api.query(query)).data.revision}
                render={revision => (
                    <Card
                        bordered={false}
                        style={{ width: 200 }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Card.Meta
                            title={revision.key}
                            // style={{ borderBottom: '1px solid #e8e8e8', fontSize: 12, padding: 10, margin: 0 }}
                            // description={project.description}
                        />
                        {/*<Scrollbar style={{ width: '100%' }} autoHeight={true} autoHeightMax={250}>
                            <List
                                size="small"
                                dataSource={revision.documents}
                                renderItem={document => (
                                    <List.Item style={{ padding: 5 }}>
                                        <List.Item.Meta
                                            avatar={<i className="fa fa-code-fork" style={{ fontSize: 25, marginLeft: 10 }}/>}
                                            title={<Link to={{ name: 'documentation.document', params: { project: 'codex', revision: 'master', document } }} style={{ display: 'block' }}>{document}</Link>}
                                        />
                                        {document === revision.default_document ? <i className="fa fa-dot-circle-o" title="Default Document" style={{ fontSize: 15, margin: 5 }}/> : null}
                                    </List.Item>
                                )}
                            />
                        </Scrollbar>*/}
                    </Card>
                )}
            >
                {this.props.children}
            </PopoverAction>
        );
    }
}


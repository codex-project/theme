import { observer } from 'mobx-react';
import React from 'react';
import { Card, List } from 'antd';
import { lazyInject } from 'ioc';
import { Api } from '@codex/api';
import { hot } from 'decorators';
import { IDefinedRoute } from 'interfaces';
import { PopoverAction } from 'components/link/PopoverAction';
import { Scrollbar } from 'components/Scrollbar';
import { Link } from 'react-router-dom';
import { Routes } from 'collections/Routes';
import { ProjectPart, Store } from 'stores';
import { Icon } from 'components/Icon';
import { clink } from 'stores/CLinkStore';


export interface ProjectPopoverActionProps {
    link: React.ReactNode
    route: IDefinedRoute
    to: string
}

@hot(module)
@observer
@clink.action('project', 'popover')
export class ProjectPopoverAction extends React.Component<ProjectPopoverActionProps> {
    @lazyInject('api') api: Api;
    @lazyInject('routes') routes: Routes;
    @lazyInject('store') store: Store;

    render() {
        let { project } = this.routes.getRouteParams(this.props.route, this.props.to); //getRouteParams(this.props.route, this.props.to);
        let query       = `{
project(projectKey: "${project}"){
    key
    display_name
    description
}
}`;

        return (
            <PopoverAction
                loader={async () => this.store.getProject(project)}
                render={(project: ProjectPart) => (
                    <Card
                        bordered={false}
                        style={{ width: 200 }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Card.Meta
                            title={project.display_name}
                            style={{ borderBottom: '1px solid #e8e8e8', fontSize: 12, padding: 10, margin: 0 }}
                            description={project.description}
                        />
                        <Scrollbar style={{ width: '100%' }} autoHeight={true} autoHeightMax={250}>
                            <List
                                size="small"
                                dataSource={Object.keys(project.revisions)}
                                renderItem={revision => (
                                    <List.Item style={{ padding: 5 }}>
                                        <List.Item.Meta
                                            avatar={<Icon name="code-fork" style={{ fontSize: 25, marginLeft: 10 }}/>}
                                            title={<Link to={this.routes.getRoute('documentation.revision').toPath({ project: project.key, revision: revision })} style={{ display: 'block' }}>{revision}</Link>}
                                        />
                                        {revision === project.default_revision ? <Icon name="dot-circle-o" title="Default Revision" style={{ fontSize: 15, margin: 5 }}/> : null}
                                    </List.Item>
                                )}
                            />
                        </Scrollbar>
                    </Card>
                )}
            >
                {this.props.children}
            </PopoverAction>
        );
    }
}


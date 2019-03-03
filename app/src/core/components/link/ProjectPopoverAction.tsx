import { observer } from 'mobx-react';
import React from 'react';
import { Card, List } from 'antd';


import { hot } from 'decorators';
import { clink, ProjectPart, Store } from 'stores';
import { lazyInject } from 'ioc';
import { Api } from '@codex/api';
import { PopoverAction } from './PopoverAction';
import { Scrollbar } from '../scrollbar';
import { Icon } from '../icon';
import { Match, RouteLink, Router } from 'router';


export interface ProjectPopoverActionProps {
    link: React.ReactNode
    match: Match<any>
    to: string
}

@hot(module)
@observer
@clink.action('project', 'popover')
export class ProjectPopoverAction extends React.Component<ProjectPopoverActionProps> {
    @lazyInject('api') api: Api;
    @lazyInject('router') router: Router;
    @lazyInject('store') store: Store;

    render() {
        let { project } = this.props.match.params; //this.routes.getRouteParams(this.props.route, this.props.to); //getRouteParams(this.props.route, this.props.to);
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
                                dataSource={Object.values(project.revisions)}
                                renderItem={revision => (
                                    <List.Item style={{ padding: 5 }}>
                                        <List.Item.Meta
                                            avatar={<Icon name="code-fork" style={{ fontSize: 25, marginLeft: 10 }}/>}
                                            title={<RouteLink to={{ name: 'documentation.revision', params: { project: project.key, revision: revision.key } }} style={{ display: 'block' }}>{revision.key}</RouteLink>}
                                        />
                                        {revision.key === project.default_revision ? <Icon name="dot-circle-o" title="Default Revision" style={{ fontSize: 15, margin: 5 }}/> : null}
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


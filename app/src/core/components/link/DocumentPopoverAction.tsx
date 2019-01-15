import { observer } from 'mobx-react';
import React from 'react';
import { Card, List } from 'antd';
import { IDefinedRoute } from 'interfaces';
import { hot } from 'decorators';
import { app, lazyInject } from 'ioc';
import { Api, api } from '@codex/api';
import { Scrollbar } from 'components/Scrollbar';
import { PopoverAction } from 'components/link/PopoverAction';
import { clink } from 'stores/CLinkStore';


export interface DocumentPopoverActionProps {
    link: React.ReactNode
    route: IDefinedRoute
    to: string
}

@hot(module)
@observer
@clink.action('document', 'popover')
export class DocumentPopoverAction extends React.Component<DocumentPopoverActionProps> {
    @lazyInject('api') api: Api;

    render() {
        let { project, revision, document } = app.routes.getRouteParams(this.props.route, this.props.to); //getRouteParams(this.props.route, this.props.to);
        let query                           = `{
document(projectKey: "${project}", revisionKey: "${revision}", documentKey: "${document}"){
    title
    subtitle
    description
}
}`;
        return (
            <PopoverAction
                loader={async () => (await this.api.query(query)).data.document}
                render={(document: Partial<api.Document>) => (
                    <Card
                        bordered={false}
                        style={{ width: 200 }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Card.Meta
                            title={document.title}
                            style={{ borderBottom: '1px solid #e8e8e8', fontSize: 12, padding: 10, margin: 0 }}
                            description={document.subtitle}
                        />
                        <Scrollbar style={{ width: '100%' }} autoHeight={true} autoHeightMax={250}>
                            <List
                                size="small"
                                dataSource={[]}
                                renderItem={item => (
                                    <List.Item style={{ padding: 5 }}>
                                        <List.Item.Meta
                                            avatar={<i className="fa fa-code-fork" style={{ fontSize: 25, marginLeft: 10 }}/>}
                                            title={<a href="#" style={{ display: 'block' }}>{item}</a>}
                                        />

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


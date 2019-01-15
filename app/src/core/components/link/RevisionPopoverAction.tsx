import { observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { IDefinedRoute } from 'interfaces';
import { hot } from 'decorators';
import { clink } from 'stores/CLinkStore';


export interface RevisionPopoverActionProps {
    link: React.ReactNode
    route: IDefinedRoute
    to: string
}

@hot(module)
@observer
@clink.action('revision', 'popover')
export class RevisionPopoverAction extends React.Component<RevisionPopoverActionProps> {

    render() {
        return <Fragment>{this.props.children}</Fragment>;
    }

    // render2() {
    //     let { project, revision } = getRouteParams(this.props.route, this.props.to);
    //     return (
    //         <PopoverAction
    //             loader={() => this.api.getRevision(project, revision)}
    //             render={revision => (
    //                 <Card
    //                     bordered={false}
    //                     style={{ width: 200 }}
    //                     bodyStyle={{ padding: 0 }}
    //                 >
    //                     <Card.Meta
    //                         title={revision.key}
    //                         style={{ borderBottom: '1px solid #e8e8e8', fontSize: 12, padding: 10, margin: 0 }}
    //                         // description={project.description}
    //                     />
    //                     <Scrollbar style={{ width: '100%' }} autoHeight={true} autoHeightMax={250}>
    //                         <List
    //                             size="small"
    //                             dataSource={revision.documents}
    //                             renderItem={document => (
    //                                 <List.Item style={{ padding: 5 }}>
    //                                     <List.Item.Meta
    //                                         avatar={<i className="fa fa-code-fork" style={{ fontSize: 25, marginLeft: 10 }}/>}
    //                                         title={<RouteLink to={{ name: 'documentation.document', params: { project: 'codex', revision: 'master', document } }} style={{ display: 'block' }}>{document}</RouteLink>}
    //                                     />
    //                                     {document === revision.default_document ? <i className="fa fa-dot-circle-o" title="Default Document" style={{ fontSize: 15, margin: 5 }}/> : null}
    //                                 </List.Item>
    //                             )}
    //                         />
    //                     </Scrollbar>
    //                 </Card>
    //             )}
    //         >
    //             {this.props.children}
    //         </PopoverAction>
    //     )
    // }
}


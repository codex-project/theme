import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { RouterState } from 'react-router5-hocs/modules/types';
import { handleRouteNode } from 'routing/handleRouteNode';

const log = require('debug')('DocumentationNode');

interface State {}

export interface DocumentationNodeProps {}


@observer
export default class DocumentationNode extends React.Component<DocumentationNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'DocumentationNode';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        // let child                                        = handleRouteNode(this);

        // if ( route ) {
        //     let name = route.name.split('.')[ 1 ];
        //     if ( name === 'project' ) {
        //         child = <DocumentationProjectNode/>;
        //     }
        //     if ( route.data.component ) {
        //         const Component = route.data.component;
        //         child           = <Component/>;
        //     }
        // }
        return (
            <div>
                <h2>DocumentationNode</h2>
                {children}
            </div>
        );
    }

}




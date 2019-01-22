import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { routeNode } from 'react-router5';
import { RouterState } from 'react-router5-hocs/modules/types';
import HomeNode from 'components/RootNode';

const log = require('debug')('DocumentationProjectNode');

interface State {}

export interface DocumentationProjectNodeProps {}


@observer
class DocumentationProjectNode extends React.Component<DocumentationProjectNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'DocumentationProjectNode';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        return (
            <div>
                <h3>DocumentationProjectNode</h3>
            </div>
        );
    }

}


export default routeNode('documentation.project')(DocumentationProjectNode);

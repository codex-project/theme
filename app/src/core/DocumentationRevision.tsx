import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { routeNode } from 'react-router5';
import { RouterState } from 'react-router5-hocs/modules/types';

const log = require('debug')('DocumentationRevision');

interface State {}

export interface DocumentationRevisionProps {}


@observer
export default class DocumentationRevision extends React.Component<DocumentationRevisionProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'DocumentationRevision';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        return (
            <div>
                <h2>DocumentationRevision</h2>
            </div>
        );
    }

}



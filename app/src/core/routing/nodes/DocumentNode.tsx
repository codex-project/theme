import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { RouterState } from 'react-router5-hocs/modules/types';

const log = require('debug')('DocumentNode');

interface State {}

export interface DocumentNodeProps {}


@observer
export default class DocumentNode extends React.Component<DocumentNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'DocumentNode';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        return (
            <div>
                <h2>DocumentNode</h2>
            </div>
        );
    }

}



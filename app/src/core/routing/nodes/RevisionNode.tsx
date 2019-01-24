import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { RouterState } from 'react-router5-hocs/modules/types';

const log = require('debug')('RevisionNode');

interface State {}

export interface RevisionNodeProps {}


@observer
export default class RevisionNode extends React.Component<RevisionNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'RevisionNode';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        return (
            <div>
                <h2>RevisionNode</h2>
            </div>
        );
    }

}



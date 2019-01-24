import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { RouterState } from 'react-router5-hocs/modules/types';

const log = require('debug')('ProjectNode');

interface State {}

export interface ProjectNodeProps {}


@observer
export default class ProjectNode extends React.Component<ProjectNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'ProjectNode';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        return (
            <div>
                <h2>ProjectNode</h2>
            </div>
        );
    }

}



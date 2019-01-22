import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { routeNode } from 'react-router5';
import { RouterState } from 'react-router5-hocs/modules/types';

const log = require('debug')('HomeNode');

interface State {}

export interface HomeNodeProps {}


@observer
class HomeNode extends React.Component<HomeNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'HomeNode';

    render() {
        return (
            <div>
                <h1>HomeNode</h1>
            </div>
        );
    }

}


export default routeNode('home')(HomeNode);

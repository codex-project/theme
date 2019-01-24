import React from 'react';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { Link as RouteLink, routeNode } from 'react-router5';
import { RouterState } from 'react-router5-hocs/modules/types';
import BaseLink from 'react-router5/types/BaseLink';
import { handleRouteNode } from 'routing/handleRouteNode';
import { TunnelProvider } from 'components/tunnel';
import Layout from 'components/layout';

const log = require('debug')('RootNode');

interface State {}

export interface RootNodeProps {}


const Link: typeof BaseLink = RouteLink as any;

@observer
class RootNode extends React.Component<RootNodeProps & RouterState, any> {
    @lazyInject('store') store: Store;

    static displayName = 'RootNode';

    render() {
        log('render', 'route', this.props.route);
        const { route, router, previousRoute, children } = this.props;
        let node                                         = handleRouteNode(this);

        return (
            <TunnelProvider>
                <Layout
                    header={null}
                >
                    <h1>RootNode</h1>
                    <ul>
                        <li><Link routeName="home">home</Link></li>
                        <li><Link routeName="documentation">documentation</Link></li>
                        <li><Link routeName="documentation.project" routeParams={{ project: 'codex' }}>documentation.project</Link></li>
                        <li><Link routeName="documentation.revision" routeParams={{ project: 'codex', revision: '2.0.0-alpha' }}>documentation.revision</Link></li>
                        <li><Link routeName="documentation.document" routeParams={{ project: 'codex', revision: '2.0.0-alpha', document: 'index' }}>documentation.document</Link></li>
                    </ul>

                    {node}
                </Layout>
            </TunnelProvider>
        );
    }

}


export default routeNode('')(RootNode);

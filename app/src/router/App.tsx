import React from 'react';
import { observer } from 'mobx-react';
import { generatePath, Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { routeMap } from './routeMap';
import { hot } from 'react-hot-loader/root';
import {Routes} from './Routes';

const log = require('debug')('router:App');

interface State {}

export interface AppProps {}


@observer
class AppComponent extends React.Component<AppProps & RouteComponentProps, any> {

    static displayName = 'AppComponent';

    render() {
        const { children, history, location, match, staticContext } = this.props;
        log('render', { history, location, match, staticContext });
        return (
            <div>
                <h3>App</h3>
                <div>{this.renderLinks()}</div>
                <div key={location.key}>
                    <Routes routes={routeMap}/>
                </div>
            </div>
        );
    }

    renderLinks() {

        const linkData                       = [
            'home',
            'documentation',
            [ 'documentation.project', { project: 'codex' } ],
            [ 'documentation.revision', { project: 'codex', revision: '2.0.0-alpha' } ],
            [ 'documentation.document', { project: 'codex', revision: '2.0.0-alpha', document: 'index' } ],
            [ 'documentation.project', { project: 'does-not-exist' } ],
            [ 'documentation.revision', { project: 'codex', revision: 'does-not-exist' } ],
            [ 'documentation.document', { project: 'codex', revision: '2.0.0-alpha', document: 'does-not-exist' } ],
        ];
        const linkStyle: React.CSSProperties = {
            border        : '1px solid black',
            padding       : 2,
            marginRight   : 2,
            fontSize      : 12,
            textDecoration: 'none',
        };
        const links                          = linkData
            .map((link: any) => {
                let result: any = { name: link };
                if ( typeof link !== 'string' ) {
                    result.name   = link[ 0 ];
                    result.params = link[ 1 ];
                }
                return result;
            })
            .filter(result => routeMap.has(result.name))
            .map(result => {
                let route   = routeMap.get(result.name);
                result.path = generatePath(route.path, result.params);
                return result;
            });

        return (
            <div>
                {links.map((link, i) => <Link key={link.path} to={link.path} style={linkStyle}>{link.path}</Link>)}
            </div>
        );
    }
}

export const App = hot(withRouter(AppComponent));
export default App;

import React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { Link as RouteLink, routeNode } from 'react-router5';
import { RouterState } from 'react-router5-hocs/modules/types';
import BaseLink from 'react-router5/types/BaseLink';
import { TunnelProvider } from 'components/tunnel';
import Layout from 'components/layout';
import { Route, Router, RouterStore } from 'routing';
import posed, { PoseGroup } from 'react-pose';
import { Button } from 'components/button';
import { CodeHighlight } from 'components/code-highlight';
import { Popover } from 'antd';
import { PopoverProps } from 'antd/lib/popover';

const log = require('debug')('RootNode');

interface State {}

export interface RootNodeProps {}

const RoutesContainer = posed.div({
    enter: {
        opacity: 1,
        delay  : 500,
        // beforeChildren: true,
        // afterChildren : true,
        // height        : '100%',
        // position      : 'relative',
    },
    exit : {
        opacity   : 0,
        transition: { duration: 500 },
        // delay         : 500,
        // beforeChildren: true,
        // afterChildren : true,
        // beforeChildren: true,
        // height        : '100%',
        // position      : 'relative',
    },
});

const Link: typeof BaseLink = RouteLink as any;

@observer
class RootNode extends React.Component<RootNodeProps & RouterState, any> {
    @lazyInject('store.router') store: RouterStore;
    @lazyInject('router') router: Router;

    static displayName = 'RootNode';

    render() {
        log('render', 'route', this.props.route);
        const { current, router, transitioning } = this.store;
        const { children }                       = this.props;
        const path                               = current && current.path ? current.path : router.buildPath(router.getOptions().defaultRoute);
        const { Component, props }               = this.getRouteData(current);


        return (
            <TunnelProvider>
                <Layout
                    header={null}
                >
                    <h1>RootNode</h1>
                    {this.renderButtons(props)}
                    <h4>Child</h4>
                    <PoseGroup animateOnMount={true}>
                        <RoutesContainer key={path}>
                            {Component ? <Component {...props} /> : Component}
                        </RoutesContainer>
                    </PoseGroup>
                </Layout>
            </TunnelProvider>
        );
    }

    getRouteData(current) {
        let { route, router, previousRoute, children, ...props } = this.props;

        if ( ! current || ! current.component ) {
            log('no ' + (! current ? 'route' : 'component'), this);
            return { Component: null, props };
        }
        let routeConfig: Partial<Route> = router.hasRoute(current.name) ? router.getRoute(current.name) : {};
        let mapData                     = routeConfig.mapDataToProps;
        if ( typeof mapData !== 'function' ) {
            mapData = (data, props) => {
                log('mapData', data, props);
                Object.assign(props, data);
            };
        }
        if ( routeConfig.wrap ) {
            Object.assign(props, { route: current, previousRoute, router });
        }

        mapData(current.data, props);

        const Component = current.component;

        log('component', { Component, current, props });

        return {
            Component,
            props,
        };
    }

    renderButtons(props) {
        const { current, router, transitioning } = this.store;
        const linkData                           = [
            'home',
            'documentation',
            'test',
            [ 'documentation.project', { project: 'codex' } ],
            [ 'documentation.revision', { project: 'codex', revision: '2.0.0-alpha' } ],
            [ 'documentation.document', { project: 'codex', revision: '2.0.0-alpha', document: 'index' } ],
            [ 'documentation.project', { project: 'does-not-exist' } ],
            [ 'documentation.revision', { project: 'codex', revision: 'does-not-exist' } ],
            [ 'documentation.document', { project: 'codex', revision: '2.0.0-alpha', document: 'does-not-exist' } ],
        ];

        const links = linkData.map((link: any) => {
            let result: any = { name: link };
            if ( typeof link !== 'string' ) {
                result.name   = link[ 0 ];
                result.params = link[ 1 ];
            }
            result.path = router.buildPath(result.name, result.params);
            return result;
        });

        let code;
        try {
            code = JSON.stringify(props, null, 4);
        } catch ( e ) {
            code = require('util').inspect(props, false, 2, false);
        }
        let popoverProps: PopoverProps = {
            overlayStyle      : { width: 700 },
            placement         : 'rightTop',
            getPopupContainer : triggerNode => document.body,
            autoAdjustOverflow: true,
        };

        return (
            <Button.Group size="small">
                <Popover {...popoverProps} content={links.map((link, i) => <Button key={i}><Link routeName={link.name} routeParams={link.params}>{link.path}</Link></Button>)}>
                    <Button>links</Button>
                </Popover>
                <Popover {...popoverProps} content={<CodeHighlight language="json" code={code}/>}>
                    <Button>props</Button>
                </Popover>
            </Button.Group>
        );

    }

}


export default routeNode('')(RootNode);

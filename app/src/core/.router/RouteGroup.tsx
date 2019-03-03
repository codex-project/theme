import React, { Component, Fragment } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { RouteDefinition, RouteState } from './types';
import { RenderRoute } from './RenderRoute';
import posed, { PoseGroup } from 'react-pose';
import { Props as PoseGroupProps } from 'react-pose/lib/components/Transition/types';
import { lazyInject } from 'ioc';
import { History, RouteMap } from 'router';
import { observer } from 'mobx-react';

const log = require('debug')('router:RouteGroup');

export interface RoutesProps {
    routes: Map<string, RouteDefinition>
    withTransitions?: boolean
    transitionGroupOptions?: PoseGroupProps
}

const makeRouteState  = (props: RouteComponentProps, definition: RouteDefinition): RouteState => {
    const { name, action, render, component, location, children, ...routeDefinition } = definition;
    return {
        name : name,
        route: { ...routeDefinition },
        ...props.location,
        ...props.match,
    };
};
const RoutesContainer = posed.div({
    enter: {
        opacity: 1,
        delay  : 500,

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

@observer
class RoutesComponent extends Component<RoutesProps & RouteComponentProps> {
    static displayName                        = 'Routes';
    static defaultProps: Partial<RoutesProps> = {};
    @lazyInject('routes') routes: RouteMap;
    @lazyInject('history') history: History;
    unlisten?: () => void;

    componentDidMount() {
        this.unlisten = this.history.listen((location, action) => {
            log('transition', action, 'to', location);
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        log('componentWillUnmount', this.unlisten);
        if ( this.unlisten ) {
            this.unlisten();
            this.unlisten = undefined;
        }
    }

    renderRoute(this: RoutesComponent, props, definition) {
        let routeState = makeRouteState(props, definition);
        log('renderRoute', routeState.name, routeState.pathname, { props, definition, routeState });
        return <RenderRoute {...props} routeState={routeState} definition={definition}/>;
    }

    render() {
        let { children, staticContext, withTransitions, ...props } = this.props;
        let routes                                                 = Array.from(this.props.routes.values());

        const sw = (
            <Switch location={this.history.location as any}>
                {routes.map((route, i) => {
                        // let render, component;
                        // if ( route.component ) {
                        //     component = route.component;
                        // } else {
                        //     render = props1 => this.renderRoute(props1, route);
                        // }
                        return (<Route
                            key={i}
                            sensitive={route.sensitive}
                            strict={route.strict}
                            path={route.path}
                            exact={route.exact}
                            // component={component}
                            render={props1 => this.renderRoute(props1, route)}
                        />);
                    },
                )}
            </Switch>
        );
        if ( ! withTransitions ) {
            return <Fragment key={this.history.location.key}>{sw}</Fragment>;
        }

        return (
            <PoseGroup animateOnMount={true}>
                <RoutesContainer key={props.location.key || props.location.pathname}>
                    {sw}
                </RoutesContainer>
            </PoseGroup>
        );
    }
}

export const RouteGroup = withRouter<RoutesProps & RouteComponentProps>(RoutesComponent as any);

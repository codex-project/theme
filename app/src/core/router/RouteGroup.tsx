import React, { Component } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { RouteDefinition, RouteState } from './types';
import { RenderRoute } from './RenderRoute';
import posed, { PoseGroup } from 'react-pose';
import { Props as PoseGroupProps} from 'react-pose/lib/components/Transition/types';


export interface RoutesProps {
    routes: Map<string, RouteDefinition>
    withTransitions?: boolean
    transitionGroupOptions?:PoseGroupProps
}

const makeRouteState = (props: RouteComponentProps, definition: RouteDefinition): RouteState => {
    const { name, action, render, component, location, children, ...routeDefinition } = definition;
    return {
        name : name,
        route: { ...routeDefinition },
        ...props.location,
        ...props.match,
    };
};

class RoutesComponent extends Component<RoutesProps & RouteComponentProps> {
    static displayName                        = 'Routes';
    static defaultProps: Partial<RoutesProps> = {};

    renderRoute(this: RoutesComponent, props, definition) {
        let routeState = makeRouteState(props, definition);
        return <RenderRoute {...props} routeState={routeState} definition={definition}/>;
    }

    render() {
        const { children, staticContext, withTransitions, ...props } = this.props;
        let routes                                                   = Array.from(this.props.routes.values());
        const sw                                                     = (
            <Switch location={props.location}>
                {routes.map((route, i) => <Route
                    key={i}
                    sensitive={route.sensitive}
                    strict={route.strict}
                    path={route.path}
                    exact={route.exact}
                    render={props1 => this.renderRoute(props1, route)}
                />)}
            </Switch>
        );
        if(!withTransitions){
            return sw;
        }

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
        return (
            <PoseGroup animateOnMount={true}>
                <RoutesContainer key={props.location.key || props.location.pathname}>
                    {sw}
                </RoutesContainer>
            </PoseGroup>
        )
    }
}

export const RouteGroup = withRouter<RoutesProps & RouteComponentProps>(RoutesComponent as any);

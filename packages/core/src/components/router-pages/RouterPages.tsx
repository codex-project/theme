import * as React from 'react';
import { hot, WithRouter, WithRouterProps } from '../../decorators';
import { IRoute } from '../../interfaces';
import { Route, Switch } from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose'

export interface PosedRouterPagesProps extends WithRouterProps {
    routes: IRoute[]
}

const RoutesContainer = posed.div({
    enter: {
        opacity       : 1,
        delay         : 300,
        beforeChildren: true
    },
    exit : { opacity: 0 }
});

// https://popmotion.io/pose/learn/route-transitions-react-router/

@hot(module)
@WithRouter()
export class RouterPages extends React.PureComponent<PosedRouterPagesProps> {
    static displayName = 'RouterPages'

    render() {
        window[ 'routerpages' ]    = this;
        const { location, routes } = this.props
        return (
            <PoseGroup>
                <RoutesContainer key={location.key || location.pathname}>
                    <Switch location={location}>
                        {routes.map((route, i) => <Route key={i} {...route} />)}
                    </Switch>
                </RoutesContainer>
            </PoseGroup>
        );
    }
}


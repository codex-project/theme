import * as React from 'react';
import { RefObject } from 'react';
import { hot, WithRouter, WithRouterProps } from '../../decorators';
import { IRoute } from '../../interfaces';
import posed, { PoseGroup } from 'react-pose';
import { CurrentPose } from 'react-pose/lib/components/PoseElement/types';
import { Route, Switch } from 'react-router';


const log = require('debug')('components:RouterPages');

export interface PosedRouterPagesProps extends WithRouterProps {
    routes: IRoute[]
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

// https://popmotion.io/pose/learn/route-transitions-react-router/

@hot(module)
@WithRouter()
export class RouterPages extends React.Component<PosedRouterPagesProps> {
    static displayName             = 'RouterPages';

    render() {
        window[ 'routerpages' ]    = this;
        const { location, routes } = this.props;
        return (
            <PoseGroup animateOnMount={true}
                       // style={{ minHeight: '100%' }}
            >
                <RoutesContainer key={location.key || location.pathname}>
                    {/*{renderRoutes(routes, { switchProps: { location } })}*/}

                    {<Switch location={location}>
                        {routes.map((route, i) => {
                            let { ...props } = route;
                            return <Route
                                key={i}
                                component={route.component}
                                exact={route.exact}
                                location={route.location}
                                path={route.path}
                                render={route.render}
                                sensitive={route.sensitive}
                                strict={route.strict}
                            />;
                        })}
                    </Switch>}
                </RoutesContainer>
            </PoseGroup>
        );
    }
}


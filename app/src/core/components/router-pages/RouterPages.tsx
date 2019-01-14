import * as React from 'react';
import { hot, WithRouter, WithRouterProps } from '../../decorators';
import { IRoute } from '../../interfaces';
import posed, { PoseGroup } from 'react-pose';
import { renderRoutes } from 'components/router-pages/renderRoutes';

export interface PosedRouterPagesProps extends WithRouterProps {
    routes: IRoute[]
}

const RoutesContainer = posed.div({
    enter: {
        opacity       : 1,
        delay         : 500,
        beforeChildren: true,
        height        : '100%',
        position      : 'relative',
    },
    exit : {
        opacity       : 0,
        transition    : { duration: 500 },
        delay         : 500,
        beforeChildren: true,
        height        : '100%',
        position      : 'relative',
    },
});

// https://popmotion.io/pose/learn/route-transitions-react-router/

@hot(module)
@WithRouter()
export class RouterPages extends React.PureComponent<PosedRouterPagesProps> {
    static displayName = 'RouterPages';

    render() {
        window[ 'routerpages' ]    = this;
        const { location, routes } = this.props;
        return (
            <PoseGroup animateOnMount={true}>
                <RoutesContainer key={location.key || location.pathname}>
                    {renderRoutes(routes, { switchProps: { location } })}

                    {/*<Switch location={location}>
                        {routes.map((route, i) => {
                            let {...props} = route;
                            return <Route key={i} {...props} />;
                        })}
                    </Switch>*/}
                </RoutesContainer>
            </PoseGroup>
        );
    }
}


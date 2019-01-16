import * as React from 'react';
import { RefObject } from 'react';
import { hot, WithRouter, WithRouterProps } from '../../decorators';
import { IRoute } from '../../interfaces';
import posed, { PoseGroup } from 'react-pose';
import { renderRoutes } from 'components/router-pages/renderRoutes';
import { CurrentPose } from 'react-pose/lib/components/PoseElement/types';


const log = require('debug')('components:RouterPages');

export interface PosedRouterPagesProps extends WithRouterProps {
    routes: IRoute[]
}

const RoutesContainer = posed.div({
    enter: {
        opacity       : 1,
        delay         : 500,
        // beforeChildren: true,
        // afterChildren : true,
        // height        : '100%',
        // position      : 'relative',
    },
    exit : {
        opacity       : 0,
        transition    : { duration: 500 },
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
export class RouterPages extends React.PureComponent<PosedRouterPagesProps> {
    static displayName             = 'RouterPages';
    ref: RefObject<HTMLDivElement> = React.createRef();
    prevHeight                     = null;

    render() {
        window[ 'routerpages' ]    = this;
        const { location, routes } = this.props;
        return (
            <PoseGroup
                // animateOnMount={true}
                // preEnterPose="preEnter"
                // enterAfterExit={true}
                onRest={() => log('onRest', this.ref)}
                style={{minHeight: '100%'}}
            >
                <RoutesContainer
                    style={{minHeight: '100%'}}
                    ref={this.ref}
                    key={location.key || location.pathname}
                    onPoseComplete={(pose: CurrentPose) => {
                        // log('onPoseComplete', pose, this.ref);
                        // if ( pose === 'enter' && this.ref && this.ref.current ) {
                        // this.prevHeight = this.ref.current.getBoundingClientRect().height;
                        // }
                    }}
                    onValueChange={{
                        opacity: (v: any) => {
                            // if ( v === 1 && this.ref && this.ref.current ) {
                            //     this.prevHeight                  = this.ref.current.getBoundingClientRect().height;
                            //     this.ref.current.style.minHeight = null;
                            // } else if ( this.ref && this.ref.current && this.prevHeight) {
                            //     this.ref.current.style.minHeight = this.prevHeight + 'px';
                            // }
                            // log('onValueChange', v, this.ref);
                        },
                    }}
                >
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


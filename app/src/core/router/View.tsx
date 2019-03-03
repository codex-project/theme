import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from '../ioc';
import { Router } from './Router';
import { observer } from 'mobx-react';
import posed, { PoseGroup } from 'react-pose';

export interface ViewProps {}

const RoutesContainer = posed.div({
    enter: {
        opacity: 1,
        delay  : 500,
    },
    exit : {
        opacity   : 0,
        transition: { duration: 500 },
    },
});

@hot(module)
@observer
export class View extends Component<ViewProps> {
    static displayName                      = 'View';
    static defaultProps: Partial<ViewProps> = {};

    @lazyInject('router') router: Router;


    render() {
        const { children, ...props } = this.props;
        return (
            <PoseGroup animateOnMount={true}>
                <RoutesContainer key={this.router.history.location.key || this.router.history.location.pathname}>
                    <If condition={this.router.started}>
                        {this.renderCurrent()}
                    </If>
                </RoutesContainer>
            </PoseGroup>
        );
    }

    renderCurrent() {
        let { current } = this.router;
        if ( current.route.component ) {
            return React.createElement(current.route.component, {routeState: current});
        }
        return null;
    }
}


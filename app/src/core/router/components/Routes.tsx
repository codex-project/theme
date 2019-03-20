import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { Router } from './../Router';
import { Route } from '../interfaces';
import { observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Switch } from './Switch';
import { View } from './View';
import { AnimatedViews } from './AnimatedViews';

const log = require('debug')('router:components:Routes');

export interface RoutesProps {
    routes: Route[]
}

@hot(module)
@observer
export class Routes extends Component<RoutesProps> {
    static displayName                        = 'Routes';
    static defaultProps: Partial<RoutesProps> = {};

    @lazyInject('router') router: Router;

    @computed get show() {return this.router.started && this.router.current;}

    render() {
        const { children, ...props } = this.props;
        let currentState             = toJS(this.router.current);
        let duration                 = 500;
        return (
            <div>
                <If condition={this.show}>
                    <AnimatedViews
                        state={currentState}
                        config={{ duration }}
                        from={{ opacity: 0 }}
                        enter={{ opacity: 1, delay: duration + 50 }}
                        leave={{ opacity: 0 }}
                    >
                        {state =>
                            <Switch state={state}>
                                {this.router.routes.toArray().map(route => {
                                    return <View
                                        key={route.name}
                                        name={route.name}
                                        route={route}
                                    />;
                                })}
                            </Switch>
                        }
                    </AnimatedViews>
                </If>
            </div>
        );
    }

}

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from '../ioc';
import { Router } from './Router';
import { Route, State } from 'router';


import { animated, config, Transition } from 'react-spring/renderprops';
import { observer } from 'mobx-react';

const log = require('debug')('router:View');


export interface RoutesProps {
}


@hot(module)
@observer
export class Routes extends Component<RoutesProps> {
    static displayName                        = 'Routes';
    static defaultProps: Partial<RoutesProps> = {};

    @lazyInject('router') router: Router;

    current = null;

    constructor(props) {
        super(props);
    }


    render() {
        const { children, ...props } = this.props;

        return (
            <div>
                <If condition={this.router.started && this.router.current}>
                    <AnimatedSwitch currentState={this.router.current}/>
                </If>
            </div>
        );
    }

}


export interface SwitchProps {
    state: State
}

export class Switch extends Component<SwitchProps> {
    static displayName                        = 'Switch';
    static defaultProps: Partial<SwitchProps> = {};

    @lazyInject('router') router: Router;

    public componentDidMount(): void {
        log('Switch mount');
    }

    render() {
        log('Switch render');
        const { children, state, ...props } = this.props;
        let element, match;

        React.Children.forEach(children, child => {
            if ( match == null && React.isValidElement(child) ) {
                element = child;
                if ( child.props[ 'name' ] === state.name ) {
                    match = true;
                }
            }
        });

        return element ? React.cloneElement(element, { match, state }) : null;

    }
}

export interface ViewProps {
    name: string,
    route: Route
    render?: (props: ViewProps) => React.ReactElement<any>

    match?: boolean
    state?: State
}

export class View extends Component<ViewProps> {
    static displayName                      = 'View';
    static defaultProps: Partial<ViewProps> = {};

    render() {
        const { children, name, route, render, match, state, ...props } = this.props;

        if ( route.component ) {
            if ( render ) {
                return render(this.props);
            }
            return React.createElement(route.component, { key: name, name, route, routeState: state });
        }
        return null;
        // const Component = route.component || ((p) => null);
        // return <Component {...{ key: name, name, route, routeState: state }} />;

        // return React.createElement(child.type, {
        //     ...child.props,
        //     children: React.createElement(route.component, { key: name, name, route, routeState: state }),
        // });
    }
}


export interface AnimatedSwitchProps {
    currentState: State
}


// @observer
export class AnimatedSwitch extends Component<AnimatedSwitchProps> {
    static displayName                                = 'AnimatedSwitch';
    static defaultProps: Partial<AnimatedSwitchProps> = {};

    @lazyInject('router') router: Router;

    render() {
        const { children, currentState, ...props } = this.props;

        return (
            <Transition
                native
                config={config.slow}
                items={currentState}
                keys={currentState.url}
                from={{ transform: 'translateY(100px)', opacity: 0 }}
                enter={{ transform: 'translateY(0px)', opacity: 1 }}
                leave={{ transform: 'translateY(100px)', opacity: 0 }}
                reset={true}
                unique={true}
            >
                {(item, state, index) => style => {
                    log('AnimatedSwitch', state, index, item, style);
                    return (
                        <Switch state={state === 'update' ? currentState : item}>
                            {this.router.routes.toArray().map(route => (
                                <View
                                    key={route.name}
                                    name={route.name}
                                    route={route}
                                    render={props => {
                                        // const Component = animated(props.route.component);
                                        // return <Component {...props} routeState={currentState} style={style}/>;
                                        return <animated.div style={style}>
                                            {React.createElement(props.route.component, { ...props, routeState: currentState })}
                                        </animated.div>;
                                    }}
                                />
                            ))}
                        </Switch>
                    );
                }}
            </Transition>
        );
    }
}


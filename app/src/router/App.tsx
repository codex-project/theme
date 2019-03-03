import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { app, inject } from './ioc';
import { Router } from './Router';
import { State } from './Transition';
import { View } from './components/View';
import { Container } from 'inversify';
import { observer } from 'mobx-react';
import { RouteLink } from './components/RouteLink';

export interface AppProps {}


@hot
@observer
export default class App extends Component<AppProps> {
    static displayName                     = 'App';
    static defaultProps: Partial<AppProps> = {};

    @inject('app') app: Container;

    state: {
        router: Router,
        current: State,
        transition: any
    } = {
        router    : app.get('router'),
        current   : app.get<Router>('router').current,
        transition: null,
    };

    setTransition = (transition: any) => this.setState({ ...this.state.transition, transition });

    constructor(props) {
        super(props);

        this.state.router.hooks.transition.tap('App', transition => {
            // transition.from.route.canLeave    =async()=> {
            //     let wait = Promise.promisify(callback => setTimeout(() => callback(null, null), 500)) as any;
            //     await wait()
            // }
            // transition.from.route.beforeLeave =async()=> {
            //     let wait = Promise.promisify(callback => setTimeout(() => callback(null, null), 500)) as any;
            //     await wait()
            // }
            // transition.to.route.canEnter      =async()=> {
            //     let wait = Promise.promisify(callback => setTimeout(() => callback(null, null), 500)) as any;
            //     await wait()
            // }
            // transition.to.route.beforeEnter   =async()=> {
            //     let wait = Promise.promisify(callback => setTimeout(() => callback(null, null), 500)) as any;
            //     await wait()
            // }
            // transition.to.route.enter         =async()=> {
            //     let wait = Promise.promisify(callback => setTimeout(() => callback(null, null), 500)) as any;
            //     await wait()
            // }

            transition.hooks.leave.tap('a', (...args) => {
                this.setTransition({
                    from : transition.from.name,
                    to   : transition.to.name,
                    state: 'leave',
                });
            });
            transition.hooks.enter.tap('a', (...args) => {
                this.setTransition({ state: 'enter' });
            });
            transition.hooks.started.tap('a', (...args) => {
                this.setTransition({
                    from : transition.from.name,
                    to   : transition.to.name,
                    state: 'start',
                });
            });
            transition.hooks.finished.tap('a', (...args) => {
                this.setTransition({ state: 'finished' });
            });
            transition.hooks.canceled.tap('a', (...args) => {
                this.setTransition({ state: 'canceled' });
            });
        });
    }

    public componentDidMount(): void {
        window[ 'App' ]    = this;
        window[ 'app' ]    = app;
        window[ 'router' ] = this.state.router;

        this.state.router.start();
    }

    public componentWillUnmount(): void {
        this.state.router.stop();
    }

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <h1>App</h1>
                <ul>
                    <li><RouteLink to="home">home</RouteLink></li>
                    <li><RouteLink to={{ name: 'first', params: { id: 'first2354tralafirst' } }}>first</RouteLink></li>
                    <li><RouteLink to={{ name: 'second', params: { id: 'second2354tralasecond' } }}>second</RouteLink></li>
                    <li><RouteLink to={{ name: 'third', params: { id: 'third2354tralathird' } }}>third</RouteLink></li>
                </ul>
                <View/>
                <pre><code>{JSON.stringify(this.state.router.current, null, 4)}</code></pre>
                <pre><code>{JSON.stringify(this.state.transition, null, 4)}</code></pre>
                {children}
            </div>
        );
    }
}


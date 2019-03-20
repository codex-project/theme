import React from 'react';
import { State } from 'router';
import { lazyInject } from 'ioc';
import { LayoutStore, Store } from 'stores';
import { hot } from 'react-hot-loader';
import { Grid,Panel } from './grid';


const log = require('debug')('pages:home');


class GridPage extends React.Component<{ routeState: State, data?: any }> {
    static displayName = 'GridPage';
    @lazyInject('store') store: Store;
    @lazyInject('store.layout') layout: LayoutStore;

    public componentDidMount(): void {
        this.layout.left.setCollapsed(true);
        this.layout.right.setShow(false);
        this.layout.header.setShow(false);
        this.layout.footer.setShow(false);
    }

    render() {
        const { children, ...props } = this.props;
        return (
            <div id="grid-page">
                <Grid>
                    <Panel key="a">a</Panel>
                    <Panel key="b">b</Panel>
                    <Panel key="c">c</Panel>
                </Grid>
            </div>
        );
    }
}

export default hot(module)(GridPage);

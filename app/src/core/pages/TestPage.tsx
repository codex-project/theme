import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RouteState } from 'router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { DragDropPanes, Pane, Panes, DragPane, DropPanes } from 'components/panes';

const log = require('debug')('pages:home');

export default class TestPage extends React.Component<{ routeState: RouteState, data?: any } & RouteComponentProps> {
    static displayName = 'TestPage';
    @lazyInject('store') store: Store;

    render() {
        let { routeState, data, children } = this.props;
        data                               = data || {};
        return (
            <div>
                <h2>TestPage</h2>
                <h4>Panes</h4>
                <Panes>
                    <Pane>Pane 1</Pane>
                    <Panes split='horizontal' >
                        <Pane>Pane 2.1</Pane>
                        <Pane>Pane 2.2</Pane>
                        <Pane>Pane 2.3</Pane>
                    </Panes>
                    <Pane>Pane 3</Pane>
                </Panes>
                <h4>DragDropPanes</h4>
                <DragDropPanes>
                    <DragPane>Pane 1</DragPane>
                    <DropPanes split='horizontal' >
                        <DragPane>Pane 2.1</DragPane>
                        <DragPane>Pane 2.2</DragPane>
                        <DragPane>Pane 2.3</DragPane>
                    </DropPanes>
                    <DragPane>Pane 3</DragPane>
                </DragDropPanes>
            </div>
        );
    }
}

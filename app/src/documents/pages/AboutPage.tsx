import * as React from 'react';
import { hot, lazyInject, RouteState, Store } from '@codex/core';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';


@hot(module)
@observer
export default class AboutPage extends React.Component<{ routeState: RouteState } & RouteComponentProps, {}> {
    @lazyInject('store') store: Store;

    public componentDidMount(): void {
        this.load();
    }

    async load() {
        await this.store.fetchDocument('codex', 'master', 'index');
    }

    render() {
        return (
            <div>
                <h2>AboutPage</h2>

                {/*<If condition={this.store.layout.left && this.store.layout.left.menu}>*/}
                {/*<Nav items={this.store.layout.left.menu}/>*/}
                {/*</If>*/}
            </div>
        );
    }
}





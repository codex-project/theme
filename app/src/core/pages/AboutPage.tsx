import * as React from 'react';
import { hot } from 'decorators';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { observer } from 'mobx-react';


@hot(module)
@observer
export default class AboutPage extends React.Component<{}, {}> {
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





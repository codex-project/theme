import * as React from 'react';
import { hot } from '../decorators';
import { lazyInject } from '../ioc';
import { Store } from '../stores';

const log = require('debug')('pages:home');
@hot(module)
export default class HomePage extends React.Component {
    static displayName = 'HomePage';
    @lazyInject('store') store: Store;

    render() {


        return (
            <div className="transition-item detail-page">
                <h2>HomePage</h2>
                <a onClick={async e => {

                    let project = await this.store.fetchDocument('codex','master','index')


                    log(project);
                }}>project</a>
            </div>
        );
    }
}

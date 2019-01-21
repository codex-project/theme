import React from 'react';
import { hot, lazyInject, Store } from '@codex/core';
import { observer } from 'mobx-react';
import { PhpdocContent,PhpdocEntity } from '@codex/phpdoc/components';
import { RouteComponentProps } from 'react-router';


@hot(module)
@observer
export default class DemoPage extends React.Component<{} & RouteComponentProps<any>, {}> {
    @lazyInject('store') store: Store;


    render() {
        const { children, match, location, history, ...props } = this.props;
        const { params }                                       = match;
        return (
            <div {...props}>
                <PhpdocContent project={params.project} revision={params.revision}>
                    <h2>DemoPage</h2>
                    <PhpdocContent.Context.Consumer>
                        {value => <PhpdocEntity query={value.manifest.default_class} />}
                    </PhpdocContent.Context.Consumer>
                </PhpdocContent>
            </div>
        );
    }
}





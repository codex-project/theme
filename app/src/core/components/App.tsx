import React from 'react';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Store } from 'stores';
import { lazyInject } from 'ioc';
import { ErrorBoundary } from 'components/errors';
import { TunnelProvider } from 'components/tunnel';
import { Layout } from 'components/layout';
import { Router, Routes } from 'router';
import { HtmlParser } from 'classes/HtmlParser';

const log = require('debug')('App');

interface State {}

export interface AppProps {}


@observer
export class App extends React.Component<AppProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('router') router: Router;
    @lazyInject('htmlparser') htmlParser: HtmlParser;

    static displayName = 'App';

    render() {
        return (
            <ErrorBoundary>
                <TunnelProvider>
                    <Layout>
                        <Helmet
                            defaultTitle={this.store.codex.display_name}
                            titleTemplate={this.store.codex.display_name + ' - %s'}
                            {...this.store.helmet}
                        />
                        <ErrorBoundary key="routes">
                            <Routes style={{ width: 'inherit' }}/>
                        </ErrorBoundary>
                        {/*{this.renderStoreController()}*/}
                    </Layout>
                </TunnelProvider>
            </ErrorBoundary>
        );
    }

    //
    // renderStoreController() {
    //
    //     return (
    //         <StoreControl store={this.store.layout} stores={{
    //             'container': {
    //                 stretch: 'boolean',
    //             },
    //             'header'   : {
    //                 show             : 'boolean',
    //                 height           : 'number',
    //                 fixed            : 'boolean',
    //                 color            : 'color.name',
    //                 logo             : 'boolean',
    //                 show_left_toggle : 'boolean',
    //                 show_right_toggle: 'boolean',
    //                 menu             : 'menu',
    //             },
    //             'left'     : {
    //                 show          : 'boolean',
    //                 width         : 'number',
    //                 fixed         : 'boolean',
    //                 collapsedWidth: 'number',
    //                 collapsed     : 'boolean',
    //                 outside       : 'boolean',
    //                 color         : 'color.name',
    //                 menu          : 'menu',
    //             },
    //             'right'    : {
    //                 show          : 'boolean',
    //                 width         : 'number',
    //                 fixed         : 'boolean',
    //                 collapsedWidth: 'number',
    //                 collapsed     : 'boolean',
    //                 outside       : 'boolean',
    //                 color         : 'color.name',
    //             },
    //             'middle'   : {
    //                 padding: 'string',
    //                 margin : 'string',
    //                 color  : 'color.name',
    //             },
    //             'content'  : {
    //                 padding: 'string',
    //                 margin : 'string',
    //                 color  : 'color.name',
    //             },
    //             'footer'   : {
    //                 show  : 'boolean',
    //                 height: 'number',
    //                 fixed : 'boolean',
    //                 color : 'color.name',
    //             },
    //         }}/>
    //     );
    // }

}


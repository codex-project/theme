import './styling/stylesheet.scss';

import { app, App, componentLoader } from '@codex/core';
import * as url from '@codex/core/utils/url';
import React from 'react';

const log = require('debug')('site:index');

app.use(app => {
    app.routes.addRoutes({
        name  : 'demo',
        path  : url.root('demo/:project/:revision'),
        exact : true,
        render: renderProps => {
            log('render', renderProps);
            const { staticContext, ...routeProps } = renderProps;
            return React.createElement(componentLoader(
                {
                    Component: async () => (await import('./DemoPage')).default,
                    revision : async () => {
                        const { params } = renderProps.match;
                        const revision   = await app.store.fetchRevision(params.project, params.revision);

                        return revision;
                    },
                },
                (loaded, props) => {
                    const { Component, revision } = loaded;
                    if ( ! Component || ! revision ) {
                        return null;
                    }
                    return <Component revision={revision} {...props}/>;
                },
                { delay: 1000 },
            ), routeProps);

            // ComponentLoader = hot(module,true)(ComponentLoader)
            // return React.createElement(ComponentLoader, props);
            // return React.cloneElement(Element);
        },
    });
});

window[ 'site' ] = module;

export { app, App };

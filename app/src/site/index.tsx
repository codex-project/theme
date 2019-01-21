import './styling/stylesheet.scss';

import { app, App, componentLoader } from '@codex/core';
import DemoPage from './DemoPage';
import * as url from '@codex/core/utils/url';
import React from 'react';

const log = require('debug')('site:index');

app.use(app => {
    app.routes.addRoutes({
        name  : 'demo',
        path  : url.root('demo/:project/:revision'),
        exact : true,
        render: renderProps => {
            const { staticContext, ...props } = renderProps;
            log('render', props);
            const ComponentLoader = componentLoader(
                {
                    revision: async () => {
                        const {params} = renderProps.match;
                        const revision = await app.store.fetchRevision(params.project,params.revision);

                        return revision;
                    },
                },
                (loaded, props) => {

                    return <DemoPage {...props}/>;
                },
                { delay: 1000 },
            );
            return React.createElement(ComponentLoader, props);
        },
    });
});


export { app, App };

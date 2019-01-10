import React from 'react';
import { componentLoader } from './utils/componentLoader';
import { Routes } from './collections/Routes';
import { ForwardToDocument } from './components/documents';
import * as url from './utils/url';
import { app } from 'ioc';
import { getPrism } from 'utils/get-prism';

const log    = require('debug')('config:routes');
const routes = new Routes();


routes.addRoutes(
    {
        name     : 'about',
        path     : url.root('/about'),
        exact    : true,
        component: componentLoader(
            () => import(/* webpackChunkName: "pages.about" */'./pages/AboutPage'),
            (loaded, props) => <loaded.default {...props} />,
            { delay: 1500 },
        ),
    },
    {
        name     : 'home',
        path     : url.root(),
        exact    : true,
        component: componentLoader(() => import(/* webpackChunkName: "pages.home" */'./pages/HomePage'), undefined, { delay: 1500 }),
    },
    {
        name : 'documentation',
        path : url.documentation(),
        exact: true,

        render: props => <ForwardToDocument {...props}/>,
    }, {
        name  : 'documentation.project',
        path  : url.documentation(':project'),
        exact : true,
        render: props => <ForwardToDocument {...props}/>,
    }, {
        name  : 'documentation.revision',
        path  : url.documentation(':project/:revision'),
        exact : true,
        render: props => <ForwardToDocument {...props}/>,
    }, {
        name  : 'documentation.document',
        path  : url.documentation(':project/:revision/:document+'),
        exact : true,
        strict: true,
        render: routeProps => React.createElement(componentLoader(
            {
                component: () => import(/* webpackChunkName: "pages.document" */'./pages/DocumentPage'),
                document : async () => {
                    // let match                             = app.routes.matchPath<{ project: string, revision: string, document: string }>(app.routes.getRoute('documentation.document'));
                    const { project, revision, document } = routeProps.match.params;
                    await app.store.fetchDocument(project, revision, document);
                    return app.store.document;
                },
                prism    : () => getPrism(),
            },
            (loaded, props) => {
                const Component = loaded.component.default;
                return <Component document={loaded.document}/>;
            },
            {
                delay: 1500,
            }),
        ),
    },
);


export { routes };

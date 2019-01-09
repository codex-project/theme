import React from 'react';
import { componentLoader } from './utils/componentLoader';
import { Routes } from './collections/Routes';
import { ForwardToDocument } from './components/documents';
import * as url from './utils/url';

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
        ),
    },
    {
        name     : 'home',
        path     : url.root(),
        exact    : true,
        component: componentLoader(() => import(/* webpackChunkName: "pages.home" */'./pages/HomePage')),
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
        name     : 'documentation.document',
        path     : url.documentation(':project/:revision/:document+'),
        component: componentLoader(
            () => import(/* webpackChunkName: "pages.document" */'./pages/DocumentPage'),
            (loaded, props) => {
                // const {project,revision,document} = props.match.params
                const Component = loaded.default;
                return <Component {...props.match.params} />;
            }),

    },
);


export { routes };

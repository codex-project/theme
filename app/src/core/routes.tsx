import React from 'react';
import { componentLoader } from './utils/componentLoader';
import { Routes } from './collections/Routes';
import { ForwardToDocument } from './components/documents';
import * as url from './utils/url';
import { app } from 'ioc';
import ErrorPage from 'pages/ErrorPage';

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
        name  : 'documentation',
        path  : url.documentation(),
        exact : true,
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
        loadComponent: async () => (await import(/* webpackChunkName: "pages.document" */'./pages/DocumentPage')).default,
        onActivate: async props => {
            const { project, revision, document } = props.match.params;
            try {
                await app.store.fetchDocument(project, revision, document);
                // log('documentation.document loader.document', { project, revision, document });
                console.groupCollapsed('documentation.document loader.document', {project,revision,document});
                console.trace('documentation.document loader.document', {project,revision,document});
                console.groupEnd();
                return {
                    error   : false,
                    document: app.store.document,
                };
            } catch ( error ) {
                log('ERROR documentation.document loader.document', error, { project, revision, document });
                return { error };
            }
        },
        render: (props, Component, data) => {
            if(data && data.error){
                return <ErrorPage error={data.error}/>
            }
        },
        render2: routeProps => React.createElement(componentLoader(
            {
                Component: async () => (await import(/* webpackChunkName: "pages.document" */'./pages/DocumentPage')).default,
                document : async () => {
                    const { project, revision, document } = routeProps.match.params;
                    try {
                        await app.store.fetchDocument(project, revision, document);
                        // log('documentation.document loader.document', { project, revision, document });
                        console.groupCollapsed('documentation.document loader.document', {project,revision,document});
                        console.trace('documentation.document loader.document', {project,revision,document});
                        console.groupEnd();
                        return {
                            error   : false,
                            document: app.store.document,
                        };
                    } catch ( error ) {
                        log('ERROR documentation.document loader.document', error, { project, revision, document });
                        return { error };
                    }
                },
            },
            (loaded, props) => {
                const Component           = loaded.Component
                const { error, document } = loaded.document;
                log('documentation.document render', { Component, error, document });
                if ( error ) {
                    return <ErrorPage error={error}/>;
                }
                return <Component document={document}/>;
            },
            {
                delay: 1500,
            }),
        ),
    },
);


export { routes };

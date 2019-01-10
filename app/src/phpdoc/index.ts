import { Application } from '@codex/core';
import * as url from '../core/utils/url';
import { componentLoader } from '../core/utils/componentLoader';
import PhpdocPage from './PhpdocPage';
import * as React from 'react';


export function install(app: Application) {
    app.use(app => {
        app.routes.addRoutes({
            name     : 'documentation.phpdoc',
            path     : url.root('phpdoc/:project/:revision'),
            exact    : true,
            component: componentLoader(
                () => import(/* webpackChunkName: "phpdoc.page" */'./PhpdocPage'),
                (loaded: { default: typeof PhpdocPage }, props) => {
                    const Component = loaded.default;
                    return React.createElement(Component, { ...props.match.params });
                }),

        });
    });
}

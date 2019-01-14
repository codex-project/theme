///<reference path="modules.d.ts"/>

import * as React from 'react';
import { Application, componentLoader, url } from '@codex/core';
import PhpdocPage from './PhpdocPage';
import { PhpdocMenuType } from './PhpdocMenuType';
import { api } from '@codex/api';


export function install(app: Application) {
    app.use(app => {
        app.routes.addRoutes({
            name  : 'documentation.phpdoc',
            path  : url.root('phpdoc/:project/:revision'),
            exact : true,
            render: routeProps => React.createElement(componentLoader(
                {
                    component: () => import(/* webpackChunkName: "phpdoc.page" */'./PhpdocPage'),
                    revision : async () => {
                        let params = routeProps.match.params;
                        params     = app.store.getDocumentParams(params.project, params.revision);
                        await app.store.fetchRevision(params.project, params.revision);
                        return app.store.revision;
                    },
                },
                (loaded: { component: { default: typeof PhpdocPage }, revision: api.Revision }, props) => {
                    const Component = loaded.component.default;
                    return React.createElement(Component, { ...props.match.params });
                },
                { delay: 1500 },
            )),
        });
        app.menus.registerType(PhpdocMenuType);
    })
    ;
}

///<reference path="modules.d.ts"/>

import { Application, BasePlugin, Plugin, RouterPlugin } from '@codex/core';
import { loadStyling } from './loadStyling';
import { MenuPlugin } from '@codex/core/menus/plugin';

export class PhpdocPlugin extends BasePlugin implements Plugin {
    name = 'phpdoc';

    install(app: Application) {
        // app.routes.addRoutes({
        //     name  : 'documentation.phpdoc',
        //     path  : url.root('phpdoc/:project/:revision'),
        //     exact : true,
        //     render: routeProps => React.createElement(componentLoader(
        //         {
        //             component: () => import(/* webpackChunkName: "phpdoc.page" */'./PhpdocPage'),
        //             loadStyling,
        //             revision : async () => {
        //                 let params = routeProps.match.params;
        //                 params     = app.store.getDocumentParams(params.project, params.revision);
        //                 await app.store.fetchRevision(params.project, params.revision);
        //                 return app.store.revision;
        //             },
        //         },
        //         (loaded: { component: { default: typeof PhpdocPage }, revision: api.Revision }, props) => {
        //             const Component = loaded.component.default;
        //             return React.createElement(Component, { revision: loaded.revision, ...props });
        //         },
        //         { delay: 1500 },
        //     )),
        // });

        if ( app.plugins.has('router') ) {
            app.plugins.get<RouterPlugin>('router').hooks.register.tap(this.name, (routeMap, router) => {
                routeMap.set('phpdoc', {
                    name         : 'phpdoc',
                    path         : app.url.phpdoc(':project/:revision'),
                    loadComponent: () => import(/* webpackChunkName: "phpdoc.page" */'./PhpdocPage'),
                    onActivate   : async (toState, fromState) => {
                        let params = toState.params;
                        params     = app.store.getDocumentParams(params.project, params.revision);
                        await app.store.fetchRevision(params.project, params.revision);
                        return app.store.revision;
                    },
                });
            });
        }
        if ( app.plugins.has('menus') ) {
            app.plugins.get<MenuPlugin>('menus').hooks.register.tap(this.name, menus => {
                menus.registerType(app.get('phpdoc.menutype'));
            });
        }
    }

    async register(bind, unbind, isBound, rebind) {
        return Promise.all([
            () => import('./PhpdocMenuType').then(value => bind('phpdoc.menutype').toConstantValue(value.PhpdocMenuType)),
            () => import('./logic/PhpdocStore').then(value => bind('store.phpdoc').to(value.PhpdocStore).inSingletonScope()),
            () => loadStyling,
        ]);

    }
}

import { Application, BasePlugin, Bind, IsBound, MenuPlugin, Rebind, Unbind } from '@codex/core';
import { loadStyling } from './loadStyling';
import React from 'react';
import { PhpdocStore } from './logic';
import { RouterPlugin } from '@codex/site/router';

export class PhpdocPlugin extends BasePlugin {
    name = 'phpdoc';

    async register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        return Promise.all([
            () => import('./PhpdocMenuType').then(value => bind('phpdoc.menutype').toConstantValue(value.PhpdocMenuType)),
            () => import('./logic/PhpdocStore').then(value => bind('store.phpdoc').to(value.PhpdocStore).inSingletonScope()),
            () => loadStyling,
        ]);
    }

    install(app: Application) {
        if ( app.plugins.has('router') ) {
            app.plugins.get<RouterPlugin>('router').hooks.register.tap(this.name, (routeMap) => {
                routeMap.set('phpdoc', {
                    name  : 'phpdoc',
                    path  : app.url.phpdoc(':project/:revision'),
                    action: async (props, routeState) => {
                        const PhpdocPage = (await import(/* webpackChunkName: "phpdoc.page" */'./PhpdocPage')).default;
                        let params       = routeState.params;
                        params           = app.store.getDocumentParams(params.project, params.revision);
                        let revision     = await app.store.fetchRevision(params.project, params.revision);
                        let manifest     = await app.get<PhpdocStore>('store.phpdoc').fetchManifest('codex', '2.0.0-alpha');
                        let file         = await manifest.fetchFile('Codex\\Codex');

                        return React.createElement(PhpdocPage, {
                            revision: app.store.revision,
                            routeState,
                            ...props,
                        });
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
}

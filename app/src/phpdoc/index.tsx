///<reference path="./modules.d.ts"/>
///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>
import * as types from './logic/types';
import { Application, BasePlugin, Bind, HtmlComponents, IsBound, MenuPlugin, Rebind, RouterPlugin, Unbind } from '@codex/core';
import React from 'react';
import { PhpdocStore } from './logic';
import {PhpdocMemberList, PhpdocDocblock, PhpdocEntity, PhpdocLink, PhpdocMethod, PhpdocPopover, PhpdocTags, PhpdocTree, PhpdocType } from './components';
import { PhpdocMenuType } from './PhpdocMenuType';
import PhpdocTestPage from './PhpdocTestPage';
import PhpdocMosaicTestPage from './PhpdocMosaicTestPage';
import { ManifestProvider } from './components/base';
import { PhpdocMethodArguments, PhpdocMethodSignature } from './components/method';

export * from './components';
export * from './logic/FQSEN';
export * from './logic/PhpdocStore';
export * from './logic/Query';
export * from './logic/Type';
export * from './logic/collections';

export { types, PhpdocPlugin };

export default class PhpdocPlugin extends BasePlugin {
    name = 'phpdoc';

    async register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        bind('phpdoc.menutype').toConstantValue(PhpdocMenuType);
        bind('store.phpdoc').to(PhpdocStore).inSingletonScope();
        // return loadStyling();
    }


    install(app: Application) {
        app.hooks.registered.tap(this.name, app => {
            const components = app.get<HtmlComponents>('components');
            components.registerMap({
                'phpdoc-docblock'         : PhpdocDocblock,
                'phpdoc-entity'           : PhpdocEntity,
                'phpdoc-link'             : PhpdocLink,
                'phpdoc-member-list'           : PhpdocMemberList,
                'phpdoc-method'           : PhpdocMethod,
                'phpdoc-method-arguments' : PhpdocMethodArguments,
                'phpdoc-method-signature' : PhpdocMethodSignature,
                'phpdoc-popover'          : PhpdocPopover,
                'phpdoc-tags'             : PhpdocTags,
                'phpdoc-tree'             : PhpdocTree,
                'phpdoc-type'             : PhpdocType,
                'phpdoc-manifest-provider': ManifestProvider,
                // 'phpdoc-content'         : PhpdocContent,
                // 'phpdoc-method-component': PhpdocMethodComponent,
                // 'phpdoc-file-component'  : PhpdocFileComponent,
            });
        });
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
                        // let manifest     = await app.get<PhpdocStore>('store.phpdoc').fetchManifest('codex', '2.0.0-alpha');
                        // let file         = await manifest.fetchFile('Codex\\Codex');

                        return React.createElement(PhpdocPage, {
                            revision: app.store.revision,
                            routeState,
                            ...props,
                        });
                    },
                });
                routeMap.set('phpdoc.test', {
                    name     : 'phpdoc.test',
                    path     : app.url.root('phpdoc-test'),
                    action: async(props,routeState) => {
                        const PhpdocTestPage = (await import('./PhpdocTestPage')).default;
                        return <PhpdocTestPage {...props} routeState={routeState} />
                    }
                });
                routeMap.set('phpdoc.mosaic.test', {
                    name     : 'phpdoc.mosaic.test',
                    path     : app.url.root('phpdoc-mosaic'),
                    component: PhpdocMosaicTestPage,
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




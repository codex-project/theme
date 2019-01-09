import { app } from '../ioc';
import { Store } from '../stores';
import { injectable } from 'inversify';
import * as React from 'react';
import { ClickParam } from 'antd/es/menu';
import { ArrayUtils } from '../collections/ArrayUtils';
import { Config } from '../classes/Config';
import { MenuItems } from './MenuItems';
import { toJS } from 'mobx';
import * as url from '../utils/url';
import { IStoreProxy } from '../stores/proxy';
import { LayoutStoreSide } from '../stores/store.layout';
import { SyncBailHook, SyncWaterfallHook } from 'tapable';
import { IMenuType, IMenuTypeConstructor } from './MenuType';
import { MenuItem } from './MenuItem';


const log = require('debug')('classes:MenuManager');
export type MenuShortTypeHandler = (this: MenuManager, item: MenuItem, store: Store) => MenuItem
export type MenuHandler = (this: MenuManager, item: MenuItem, event: ClickParam, store: Store, items: MenuItems) => void
export type MenuCompiler = (this: MenuManager, item: MenuItem, store: Store) => void

@injectable()
export class MenuManager {
    // @lazyInject('store') store: Store;

    public readonly hooks = {
        defaults: new SyncWaterfallHook<MenuItem, MenuItem | undefined>([ 'item', 'parent' ]),
        pre     : new SyncWaterfallHook<MenuItem>([ 'item' ]),
        post    : new SyncWaterfallHook<MenuItem>([ 'item' ]),
        handle  : new SyncBailHook<MenuItem, any, MenuItems>([ 'item', 'event', 'items' ]),
    };

    public readonly types = new Map<string, IMenuType>();

    constructor() {
        // installer(this);
    }


    callDefaults(item: MenuItem, parent?: MenuItem): MenuItem { return this.hooks.defaults.call(item, parent); }

    callPre(item: MenuItem): MenuItem { return this.hooks.pre.call(item); }

    callPost(item: MenuItem): MenuItem { return this.hooks.post.call(item); }

    defaults(items: MenuItem[], parent?: MenuItem): MenuItem[] { return ArrayUtils.mapItems(items, (item, _parent) => this.callDefaults(item, _parent || parent));}

    pre(items: MenuItem[]): MenuItem[] { return ArrayUtils.mapItems(items, (item, parent) => this.callPre(item));}

    post(items: MenuItem[]): MenuItem[] { return ArrayUtils.mapItems(items, (item, parent) => this.callPost(item));}

    apply(items: MenuItem[], parent?: MenuItem): MenuItem[] {
        items = this.defaults(items, parent);
        items = this.pre(items);
        items = this.post(items);

        items = ArrayUtils.mapItems(items, (item, parent) => this.compile(item));
        return items;
    }

    registerType(Type: IMenuTypeConstructor) {
        const type = app.resolve<IMenuType>(Type);
        this.types.set(type.name, type);
        this.hooks.pre.tap(type.name, item => {
            if ( type.test(item) ) {
                return type.pre(item);
            }
            return item;
        });
        this.hooks.post.tap(type.name, item => {
            if ( type.test(item) ) {
                return type.post(item);
            }
            return item;
        });
        this.hooks.handle.tap(type.name, (item, event, items) => {
            if ( type.test(item) ) {
                log('handle', type.name, { item, event, items });
                return type.handle(item, event, items);
            }
        });
        return this;
    }

    createMenu(items: MenuItem[]) {
        const menu = MenuItems.from(items);
        return menu;
    }

    protected getTypes(item: MenuItem): IMenuType[] {
        return Array.from(this.types.values()).filter((type, name) => type.test(item));
    }

    registerCompiler(type: string, handler: MenuCompiler) { }

    registerHandler(type: string, handler: MenuHandler) { }

    registerShortType(name: string, handler: MenuShortTypeHandler) { }

    protected compile(item: MenuItem): MenuItem {
        let config = new Config();
        config.merge({ ...item });

        // circular reference workaround
        // let store = this.store;
        config.set('store', () => app.store);

        Object.keys(item).forEach(key => {
            let value = config.get(key);
            if ( item[ key ] !== value ) {
                item[ key ] = value;
            }
        });

        return item;
    }

    public handleMenuItemClick(item: MenuItem, event: React.MouseEvent<any>, items: MenuItems) {
        this.compile(item);
        this.hooks.handle.call(item, event, items);

        // if ( false === this.handlers.has(item.type) ) {
        //     console.warn(`MenuManager::handleMenuItemClick. Could not find handler [${item.type}], `);
        //     return;
        // }
        // let handler = this.handlers.get(item.type);
        // // this.applyCompilers(item);
        // log('handleMenuItemClick', { item, event, handler });
        // handler.apply(this, [ item, event, this.store, items, this ]);
    }
}

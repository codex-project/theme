import { app } from '../ioc';
import { injectable } from 'inversify';
import * as React from 'react';
import { ArrayUtils } from '../collections/ArrayUtils';
import { Config } from '../classes/Config';
import { MenuItems } from './MenuItems';
import { SyncBailHook, SyncWaterfallHook } from 'tapable';
import { IMenuType, IMenuTypeConstructor, IMenuTypeStage } from './MenuType';
import { toJS } from 'mobx';
import { MenuItem } from '@codex/api';

const log = require('debug')('classes:MenuManager');

@injectable()
export class MenuManager {
    public readonly hooks = {
        // defaults: new SyncWaterfallHook<MenuItem, MenuItem | undefined>([ 'item', 'parent' ]),
        // pre     : new SyncWaterfallHook<MenuItem>([ 'item' ]),
        // post    : new SyncWaterfallHook<MenuItem>([ 'item' ]),
        handle  : new SyncBailHook<MenuItem, any, MenuItems>([ 'item', 'event', 'items' ]),
    };

    public readonly types = new Map<string, IMenuType>();

    // callDefaults(item: MenuItem, parent?: MenuItem): MenuItem { return this.hooks.defaults.call(item, parent); }
    // callPre(item: MenuItem): MenuItem { return this.hooks.pre.call(item); }
    // callPost(item: MenuItem): MenuItem { return this.hooks.post.call(item); }

    callDefaults(item: MenuItem, parent?: MenuItem): MenuItem {
        this.types.forEach(type => {
            if ( type.test(item,'defaults') ) {
                item = type.defaults(item, parent);
            }
        });
        return item;
    }

    callPre(item: MenuItem): MenuItem {
        this.types.forEach(type => {
            if ( type.test(item, 'pre') ) {
                item = type.pre(item);
            }
        });
        return item;
    }

    callPost(item: MenuItem): MenuItem {
        this.types.forEach(type => {
            if ( type.test(item, 'post') ) {
                item = type.post(item);
            }
        });
        return item;
    }

    defaults(items: MenuItem[], parent?: MenuItem): MenuItem[] { return ArrayUtils.mapItems(items, (item, _parent) => this.callDefaults(item, _parent || parent));}

    pre(items: MenuItem[]): MenuItem[] { return ArrayUtils.mapItems(items, (item, parent) => this.callPre(item));}

    post(items: MenuItem[]): MenuItem[] { return ArrayUtils.mapItems(items, (item, parent) => this.callPost(item));}

    apply(items: MenuItem[], parent?: MenuItem): MenuItem[] {
        items = this.defaults(items, parent);
        items = this.pre(items);
        items = this.post(items);
        items = ArrayUtils.mapItems(items, (item, parent) => {
            if ( item.__raw === undefined ) {
                let { children, ...__raw } = toJS(item);
                item.__raw                 = { ...__raw };
            }
            return this.compile(item);
        });
        return items;
    }

    registerType(Type: IMenuTypeConstructor) {
        const type = app.resolve<IMenuType>(Type);
        this.types.set(type.name, type);
        // this.hooks.pre.tap(type.name, item => {
        //     if ( type.test(item) ) {
        //         item = type.pre(item); //type.hooks.pre.call(type.pre(item));
        //     }
        //     return item;
        // });
        // this.hooks.post.tap(type.name, item => {
        //     if ( type.test(item) ) {
        //         item = type.post(item); //type.hooks.post.call(type.post(item));
        //     }
        //     return item;
        // });
        this.hooks.handle.tap(type.name, (item, event, items) => {
            if ( type.test(item, 'handle') ) {
                log('handle', type.name, { item, event, items });
                // type.hooks.handle.call(item, event, items);
                let handled = type.handle(item, event, items);
                // type.hooks.handled.call(item, event, items);
                return handled;
            }
        });

        return this;
    }

    public getType<T extends IMenuType>(name: string): T {return this.types.get(name) as T; }

    protected getTypes(item: MenuItem, stage:IMenuTypeStage): IMenuType[] {
        return Array.from(this.types.values()).filter((type, name) => type.test(item,stage));
    }

    compile(item: MenuItem): MenuItem {
        let config = new Config();
        config.merge({ ...item.__raw });

        // circular reference workaround
        // let store = this.store;
        config.set('store', app.store);

        Object.keys(item)
            .filter(key => [ '__raw', 'children' ].includes(key) === false)
            .forEach(key => {
                let value = config.get(key);
                if ( item.__raw[ key ] !== value ) {
                    item[ key ] = value;
                }
            });

        return item;
    }

    public handleMenuItemClick(item: MenuItem, event: React.MouseEvent<any>, items: MenuItems) {
        this.compile(item);
        this.hooks.handle.call(item, event, items);
    }
}

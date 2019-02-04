import { app } from '../ioc';
import { injectable } from 'inversify';
import React from 'react';
import { ArrayUtils } from '../collections/ArrayUtils';
import { Config } from '../classes/Config';
import { MenuItems } from './MenuItems';
import { SyncBailHook, SyncWaterfallHook } from 'tapable';
import { IMenuType, IMenuTypeConstructor, IMenuTypeStage } from './MenuType';
import { toJS } from 'mobx';
import { MenuItem } from '@codex/api';
import { DynamicMenu } from '../components/dynamic-menu/DynamicMenu';

const log = require('debug')('classes:MenuManager');

@injectable()
export class MenuManager {
    public readonly hooks = {
        handle     : new SyncBailHook<MenuItem, any, MenuItems>([ 'item', 'event', 'items' ]),
        renderInner: new SyncBailHook<MenuItem, DynamicMenu, any, React.ReactElement<any>>([ 'item', 'menu' ]),
        render     : new SyncBailHook<React.ReactElement<any>, MenuItem, DynamicMenu, React.ReactElement<any>>([ 'inner', 'item', 'menu' ]),
        rendered   : new SyncWaterfallHook<React.ReactElement<any>, MenuItem, DynamicMenu>([ 'element', 'item', 'menu' ]),
    };

    public readonly types = new Map<string, IMenuType>();

    callDefaults(item: MenuItem, parent?: MenuItem): MenuItem {
        this.types.forEach(type => {
            if ( type.test(item, 'defaults') ) {
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

        this.hooks.handle.tap(type.name, (item, event, items) => {
            if ( type.test(item, 'handle') ) {
                log('handle', type.name, { item, event, items });
                // type.hooks.handle.call(item, event, items);
                let handled = type.handle(item, event, items);
                // type.hooks.handled.call(item, event, items);
                return handled;
            }
        });

        if ( type.renderInner ) {
            this.hooks.renderInner.tap(type.name, (item, menu) => {
                if ( type.test(item, 'renderInner') ) {
                    return type.renderInner(item, menu);
                }
            });
        }
        if ( type.render ) {
            this.hooks.render.tap(type.name, (inner, item, menu) => {
                if ( type.test(item, 'render') ) {
                    return type.render(inner, item, menu);
                }
            });
        }
        if ( type.rendered ) {
            this.hooks.rendered.tap(type.name, (element, item, menu) => {
                if ( type.test(item, 'rendered') ) {
                    return type.rendered(element, item, menu);
                }
            });
        }

        return this;
    }

    public getType<T extends IMenuType>(name: string): T {return this.types.get(name) as T; }

    protected getTypes(item: MenuItem, stage: IMenuTypeStage): IMenuType[] {
        return Array.from(this.types.values()).filter((type, name) => type.test(item, stage));
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

    public renderInner(item: MenuItem, menu: DynamicMenu): React.ReactElement<any> {
        return this.hooks.renderInner.call(item, menu);
    }

    public render(inner: React.ReactElement<any>, item: MenuItem, menu: DynamicMenu): React.ReactElement<any> {
        return this.hooks.render.call(inner, item, menu);
    }

    public rendered(element: React.ReactElement<any>, item: MenuItem, menu: DynamicMenu): React.ReactElement<any> {
        return this.hooks.rendered.call(element, item, menu);
    }
}

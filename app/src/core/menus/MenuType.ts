import { injectable } from 'inversify';
import { Application } from '../classes/Application';
import { app } from '../ioc';
import { MenuItem } from '@codex/api';
import { MenuItems } from './MenuItems';
import { SyncBailHook, SyncHook, SyncWaterfallHook } from 'tapable';
import React from 'react';
import {DynamicMenu} from '../components/dynamic-menu/DynamicMenu';

export type MenuTypeHooks<T> = {
    pre: SyncWaterfallHook<MenuItem>,
    post: SyncWaterfallHook<MenuItem>,
    handle: SyncBailHook<MenuItem, any, MenuItems>,
    handled: SyncBailHook<MenuItem, any, MenuItems>,
} & T

@injectable()
export abstract class MenuType implements IMenuType {
    name = this.constructor.name;

    public static makeHooks<T extends Record<string, any>>(hooks?: T): MenuTypeHooks<T> {
        hooks         = hooks || {} as any;
        hooks.pre     = new SyncHook<MenuItem>([ 'item' ]);
        hooks.post    = new SyncHook<MenuItem>([ 'item' ]);
        hooks.handle  = new SyncHook<MenuItem, any, MenuItems>([ 'item', 'event', 'items' ]);
        hooks.handled = new SyncHook<MenuItem, any, MenuItems>([ 'item', 'event', 'items' ]);
        return hooks as any;
    };

    public readonly hooks = MenuType.makeHooks();

    get app(): Application { return app; }

    abstract test(item: MenuItem, stage: IMenuTypeStage): boolean

    defaults(item: MenuItem, parent?: MenuItem) {
        return item;
    }

    handle(item: MenuItem, event: any, items: MenuItems) {

    }

    pre(item: MenuItem) {
        return item;
    }

    post(item: MenuItem) {
        return item;
    }

    boot() {

    }
}

export type IMenuTypeStage = 'defaults' | 'pre' | 'post' | 'boot' | 'handle' | 'renderInner' | 'render' | 'rendered';

export interface IMenuType {
    name: string
    hooks: MenuTypeHooks<{}>

    test(item: MenuItem, stage: IMenuTypeStage): boolean

    handle(item: MenuItem, event: any, items: MenuItems): void | any

    defaults(item: MenuItem, parent?: MenuItem): MenuItem

    pre(item: MenuItem): MenuItem

    post(item: MenuItem): MenuItem

    boot(): void | any

    renderInner?(item:MenuItem,menu:DynamicMenu)
    render?(inner:React.ReactElement<any>,item:MenuItem,menu:DynamicMenu)
    rendered?(element:React.ReactElement<any>, item:MenuItem,menu:DynamicMenu)
}

export interface IMenuTypeConstructor {
    new(...params: any[]): IMenuType
}

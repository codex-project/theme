import { BasePlugin } from 'classes/Plugin';
import { Application } from 'classes/Application';
import { SyncHook } from 'tapable';
import { getRandomId } from 'utils/general';
import * as menuTypes from './types';
import { MenuManager, MenuType } from 'menus';

export interface MenuPluginOptions {
}

export class MenuPlugin extends BasePlugin<MenuPluginOptions> {
    name  = 'menu';
    hooks = {
        register: new SyncHook<MenuManager>([ 'menus' ]),
    };

    constructor(options: MenuPluginOptions = {}) {
        super({
            ...options,
        });
        this.hooks.register.tap(this.name, (menus) => {
            menus.registerType(class extends MenuType {
                name = 'defaults'
                test = item => true;

                public defaults(item, parent) {
                    if ( item.id === undefined ) {
                        item.id = getRandomId(20);
                    }
                    if ( parent ) {
                        item.parent = parent.id;
                    }
                    if ( item.selected === undefined ) {
                        item.selected = false;
                    }
                    if ( item.expand === undefined ) {
                        item.expand = false;
                    }
                    return item;
                }
            });
            Object.keys(menuTypes).forEach(key => menus.registerType(menuTypes[ key ]));
        });
    }

    install(app: Application) {
        let {} = this.options;

        app.hooks.register.tap(this.name, (app) => {
            app.bind<MenuManager>('menumanager').to(MenuManager).inSingletonScope();
        });
        app.hooks.registered.tap(this.name, (app) => {
            let menus = app.get<MenuManager>('menumanager');
            this.hooks.register.call(menus)
        });
        app.hooks.boot.tap(this.name, (app) => {
            app.menus.types.forEach(type => {
                type.boot();
            });
        });
    }
}

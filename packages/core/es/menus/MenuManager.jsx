var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { app } from 'ioc';
import { injectable } from 'inversify';
import { ArrayUtils } from 'collections/ArrayUtils';
import { Config } from 'classes/Config';
import { MenuItems } from './MenuItems';
import { toJS } from 'mobx';
import { url } from 'utils/url';
import { SyncBailHook, SyncWaterfallHook } from 'tapable';
const log = require('debug')('classes:MenuManager');
let MenuManager = class MenuManager {
    constructor() {
        // @lazyInject('store') store: Store;
        this.hooks = {
            defaults: new SyncWaterfallHook(['item', 'parent']),
            pre: new SyncWaterfallHook(['item']),
            post: new SyncWaterfallHook(['item']),
            handle: new SyncBailHook(['item', 'event', 'items']),
        };
        this.types = new Map();
        // installer(this);
    }
    callDefaults(item, parent) { return this.hooks.defaults.call(item, parent); }
    callPre(item) { return this.hooks.pre.call(item); }
    callPost(item) { return this.hooks.post.call(item); }
    defaults(items, parent) { return ArrayUtils.mapItems(items, (item, _parent) => this.callDefaults(item, _parent || parent)); }
    pre(items) { return ArrayUtils.mapItems(items, (item, parent) => this.callPre(item)); }
    post(items) { return ArrayUtils.mapItems(items, (item, parent) => this.callPost(item)); }
    apply(items, parent) {
        items = this.defaults(items, parent);
        items = this.pre(items);
        items = this.post(items);
        items = ArrayUtils.mapItems(items, (item, parent) => this.compile(item));
        return items;
    }
    registerType(Type) {
        const type = app.resolve(Type);
        this.types.set(type.name, type);
        this.hooks.pre.tap(type.name, item => {
            if (type.test(item)) {
                return type.pre(item);
            }
            return item;
        });
        this.hooks.post.tap(type.name, item => {
            if (type.test(item)) {
                return type.post(item);
            }
            return item;
        });
        this.hooks.handle.tap(type.name, (item, event, items) => {
            if (type.test(item)) {
                log('handle', type.name, { item, event, items });
                return type.handle(item, event, items);
            }
        });
        return this;
    }
    createMenu(items) {
        const menu = MenuItems.from(items);
        return menu;
    }
    getTypes(item) {
        return Array.from(this.types.values()).filter((type, name) => type.test(item));
    }
    registerCompiler(type, handler) { }
    registerHandler(type, handler) { }
    registerShortType(name, handler) { }
    compile(item) {
        let config = new Config();
        config.merge(Object.assign({}, item));
        // circular reference workaround
        // let store = this.store;
        config.set('store', () => app.store);
        Object.keys(item).forEach(key => {
            let value = config.get(key);
            if (item[key] !== value) {
                item[key] = value;
            }
        });
        return item;
    }
    handleMenuItemClick(item, event, items) {
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
};
MenuManager = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], MenuManager);
export { MenuManager };
function installer(manager) {
    manager.registerShortType('project', (item, store) => {
        // if ( item.type && item.to && item.to.pathname ) return item;
        // if ( item.revision || item.document ) return item;
        item.type = 'router-link';
        let params = {
            project: item.project || (store.project ? store.project.key : store.codex.default_project),
        };
        if (!store.hasProject(params.project)) {
            item.to = { pathname: url.documentation() };
            return item;
        }
        let project = store.getProject(params.project);
        item.to = { pathname: url.documentation(`${params.project}/${project.default_revision}/${project.revisions[project.default_revision]}`) };
        return item;
    });
    manager.registerShortType('revision', (item, store) => {
        item.type = 'router-link';
        let params = {
            project: item.project || (store.project ? store.project.key : store.codex.default_project),
            revision: item.revision || store.revision.key,
        };
        if (!store.hasProject(params.project)) {
            item.to = { pathname: url.documentation() };
            return item;
        }
        let project = store.getProject(params.project);
        item.to = { pathname: url.documentation(`${params.project}/${params.revision}/${project.revisions[project.default_revision]}`) };
        return item;
    });
    manager.registerShortType('document', (item, store) => {
        item.type = 'router-link';
        let params = {
            project: item.project || (store.project ? store.project.key : store.codex.default_project),
            revision: item.revision || store.revision.key,
            document: item.document,
        };
        item.to = { pathname: url.documentation(`${params.project}/${params.revision}/${params.document}`) };
        return item;
    });
    manager.registerShortType('revisions', function (item, store) {
        item.children = [
            { type: 'header', label: 'revisions' },
            { type: 'divider' },
        ];
        let params = {
            project: item.project || (store.project ? store.project.key : store.codex.default_project),
        };
        if (!store.hasProject(params.project)) {
            item.to = { pathname: url.documentation() };
            return item;
        }
        let project = store.getProject(params.project);
        toJS(project.revisions).forEach(revision => {
            item.children.push({
                type: 'router-link',
                to: { pathname: url.documentation(`${project.key}/${revision.key}/${revision.default_document}`) },
                label: revision.key,
            });
        });
        item.children = this.apply(item.children);
        return item;
    });
    manager.registerShortType('projects', function (item, store) {
        item.children = [
            { type: 'header', label: 'Projects' },
            { type: 'divider' },
        ];
        toJS(store.codex.projects).forEach(project => {
            let default_document = store.getRevision(project.key, project.default_revision).default_document;
            item.children.push({
                type: 'router-link',
                to: { pathname: url.documentation(`${project.key}/${project.default_revision}/${default_document}`) },
                icon: 'fa-folder',
                label: project.display_name,
                sublabel: project.description,
            });
        });
        item.children = this.apply(item.children);
        return item;
    });
    manager.registerShortType('href', (item, store) => {
        if (item.type)
            return item;
        item.type = 'link';
        return item;
    });
    // manager.registerCompiler('router-link', (item, store) => {
    //     if ( item.to !== undefined ) {
    //
    //         if ( item.to.pathname === undefined && item.to.name !== undefined ) {
    //             let route = app.routes.findBy('name', item.to.name);
    //             if ( ! route ) {
    //                 console.warn(`Could not get route '${item.to.name}' for item.id '${item.id}'`, item);
    //             } else {
    //                 // item.to.pathname = app.routes.generatePath(route.path, item.to.params);
    //             }
    //         }
    //
    //         try {
    //             // item.selected = app.history.location.pathname === item.to.pathname; //locationsAreEqual(this.router.location, item.to)
    //         } catch ( e ) {
    //             console.warn(e);
    //         }
    //     }
    // });
    // click handlers
    manager.registerHandler('router-link', (item, event, store) => {
        if (item.to.replace) {
            app.history.replace(item.to);
            return;
        }
        app.history.push(item.to);
        // store.router.navigate(item.to.name, item.to.params, { reload: true });
    });
    manager.registerHandler('custom', (item, event, store) => {
        log('custom handler', { item, event });
        if (item.custom) {
            item.custom(item, event);
        }
    });
    manager.registerHandler('sub-menu', (item, event, store) => {
        log('handler sub-menu', { item, event, store, manager });
        item.expand = !item.expand;
    });
    manager.registerHandler('side-menu', (item, event, store, items) => {
        log('handler side-menu', { item, event, store, manager });
        let side = store.layout[item.side];
        let { show } = side;
        // side is closed, open it
        if (show === false) {
            // side.setMeta('sideMenuParentItem', item.id);
            side.menu = toJS(item.children);
            side.show = true;
            item.selected = true;
        }
        else {
            if (side.meta.sideMenuParentItem !== item.id) {
                items.items(side.meta.sideMenuParentItem).deselect();
                side.meta.sideMenuParentItem = item.id;
                side.menu = toJS(item.children);
                item.selected = true;
                side.collapsed = false;
            }
            else {
                side.meta.sideMenuParentItem = undefined;
                side.collapsed = true;
                item.selected = false;
            }
            // side is open with a menu by another item
            // keep it open and set the menu to this item
            // if ( side.meta.sideMenuParentItem !== item.id ) {
            //     item.menu().item(side.meta.sideMenuParentItem).deselect();
            //     side.setMeta('sideMenuParentItem', item.id);
            //     side.menu = toJS(item.children) as any;
            //     item.selected = true;
            // } else {
            //     side.show = false;
            //     item.selected = false;
            // }
        }
        log('side-menu', item.side, { side: store.layout[item.side], item: toJS(item) });
    });
}

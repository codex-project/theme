import { ArrayUtils } from 'collections/ArrayUtils';
import * as React from 'react';
import { lazyInject } from 'ioc';
import { MenuManager } from 'menus/MenuManager';
import { api } from '@codex/api';
import { menus } from 'utils/menus';

export type IMenuItemItems<T> = string | string[] | T | T[]

export class MenuItems<T extends api.MenuItem = api.MenuItem> extends Array<T> implements Array<T> {
    @lazyInject('menumanager') manager: MenuManager;

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, MenuItems.prototype);
    }

    static from(items: any[]): MenuItems {
        let menu = new MenuItems();
        menu.push(...items);
        return menu;
    }

    first() { return this[ 0 ]; }

    last() { return this[ this.length - 1 ]; }

    findBy(key: keyof T, value: any): T | undefined { return this.rfind(item => item[ key ] === value); }

    where(key: keyof T, value: any): MenuItems<T> { return this.rfilter(item => item[ key ] === value); }

    whereNot(key: keyof T, value: any): MenuItems<T> { return this.rfilter(item => item[ key ] !== value); }

    rfilter(predicate: (value: T, index: number, obj: T[]) => boolean): MenuItems<T> { return new MenuItems(...ArrayUtils.rfilter(this, predicate)); }

    rfind(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined { return ArrayUtils.rfind(this, predicate); }

    item(id: string) { return this.findBy('id', id); }

    items(ids: string[] = []) { return this.rfilter(item => ids.includes(item.id)); }

    selected() { return this.where('selected', true);}

    unselected() { return this.whereNot('selected', true);}

    expanded() { return this.where('expand', true);}

    collapsed() { return this.whereNot('expand', true);}

    ids(): string[] {return this.map(i => i.id);}

    collapse(items?: IMenuItemItems<T>) {
        this.getItems(items).forEach(item => item.expand = false);
        return this;
    }

    collapseAll() {
        this.expanded().collapse();
        return this;
    }

    expand(items?: IMenuItemItems<T>) {
        this.getItems(items).forEach(item => item.expand = true);
        return this;
    }

    expandAll() {
        this.collapsed().collapse();
        return this;
    }

    select(items?: IMenuItemItems<T>) {
        this.getItems(items).forEach(item => item.selected = true);
        return this;
    }

    deselect(items?: IMenuItemItems<T>) {
        this.getItems(items).forEach(item => item.selected = false);
        return this;
    }

    deselectAll() {
        this.selected().deselect();
        return this;
    }

    handleClick(item: string | T, e: React.MouseEvent = null) {
        if ( typeof item === 'string' ) {
            item = this.item(item);
        }
        return this.manager.handleMenuItemClick(item, e, this);
    }

    getItems(items: IMenuItemItems<T> = this): MenuItems<T> {
        if ( ! Array.isArray(items) ) {
            items = [ items ] as any;
        }
        let res = new MenuItems<T>();
        (items as any[]).forEach(item => {
            if ( typeof item === 'string' ) {
                res.push(this.item(item));
            }
            res.push(item);
        });
        return res;
    }

    getParentsFor(item: string | T): MenuItems<T> {
        if ( typeof item === 'string' ) {
            item = this.item(item);
        }
        let parentId = item[ 'parent' ];
        let parents  = [];
        while ( parentId ) {
            let parent = this.item(parentId);
            parents.push(parent);
            parentId = parent[ 'parent' ];
        }
        return new MenuItems(...parents);
    }

    expandParentsForSelected() {
        this.selected().forEach(item => this.getParentsFor(item).forEach(parent => parent.expand = true));
    }

    canExpandParentsForSelected() {
        return this.selected().filter(item => this.getParentsFor(item).find(parent => parent.expand === false) !== undefined).length > 0;
    }

    findActiveFromRoute() {
        return menus.getActiveFromRoutePath(this) as T | undefined;
    }

    selectActiveFromRoute(expandParents: boolean = false, collapseOthers: boolean = false) {
        let active = this.findActiveFromRoute();
        if ( active ) {
            if ( expandParents && collapseOthers ) {
                this.collapseAll();
            }
            this.select(active);
            if ( expandParents ) {
                this.expandParentsForSelected();
            }
        }
    }
}

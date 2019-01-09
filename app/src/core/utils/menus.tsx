import { strEnsureLeft } from '../utils/general';
import { app } from '../ioc';
import { Routes } from '../collections/Routes';
import { ArrayUtils } from '../collections/ArrayUtils';
import { MenuItems } from '../menus';
import { MenuItem } from '../menus/MenuItem';

const log = require('debug')('utils:menus');

export function findBy(items: MenuItem[], key: string, value: any) {
    return ArrayUtils.rfind(items, item => item[ key ] === value);
}



export function toPath(item: MenuItem): string | undefined {
    if ( item.to && item.to.pathname ) {
        return item.to.pathname;
    }
    if ( item.path ) {
        return strEnsureLeft(item.path, '/');
    }
    if ( item.document ) {
        return strEnsureLeft(item.document, '/');
    }
}

export function isPath(item: MenuItem): boolean {
    return toPath(item) !== undefined;
}

export function getActiveFromRoutePath(items: MenuItems) {
    let current = app.get<Routes>('routes').history.location.pathname;
    if ( ! current ) return;
    let active = items.rfind(item => {
        return current === toPath(item);
    });
    return active;
}

export function getAllParentsIds(items: MenuItem[], item: any): string[] {
    if ( ! item.parent ) return [];
    let ids     = [];
    let current = item;
    while ( current && current.parent ) {
        let found = ArrayUtils.rfind(items, item => item[ 'id' ] === current.parent);
        if ( found ) ids.push(found[ 'id' ]);
        current = found;
    }
    return ids;
}

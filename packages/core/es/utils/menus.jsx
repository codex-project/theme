import { strEnsureLeft } from 'utils/general';
import { app } from 'ioc';
import { ArrayUtils } from 'collections/ArrayUtils';
const log = require('debug')('utils:menus');
export var menus;
(function (menus) {
    function findBy(items, key, value) {
        return ArrayUtils.rfind(items, item => item[key] === value);
    }
    menus.findBy = findBy;
    function toPath(item) {
        if (item.to && item.to.pathname) {
            return item.to.pathname;
        }
        if (item.path) {
            return strEnsureLeft(item.path, '/');
        }
        if (item.document) {
            return strEnsureLeft(item.document, '/');
        }
    }
    menus.toPath = toPath;
    function isPath(item) {
        return toPath(item) !== undefined;
    }
    menus.isPath = isPath;
    function getActiveFromRoutePath(items) {
        let current = app.get('routes').history.location.pathname;
        if (!current)
            return;
        let active = items.rfind(item => {
            return current === toPath(item);
        });
        return active;
    }
    menus.getActiveFromRoutePath = getActiveFromRoutePath;
    function getAllParentsIds(items, item) {
        if (!item.parent)
            return [];
        let ids = [];
        let current = item;
        while (current && current.parent) {
            let found = ArrayUtils.rfind(items, item => item['id'] === current.parent);
            if (found)
                ids.push(found['id']);
            current = found;
        }
        return ids;
    }
    menus.getAllParentsIds = getAllParentsIds;
})(menus || (menus = {}));

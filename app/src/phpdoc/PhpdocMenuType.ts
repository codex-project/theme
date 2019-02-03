import {  MenuType, url } from '@codex/core';
import { api } from '@codex/api';

const name = 'phpdoc';
const log  = require('debug')('menus:types:' + name);

export class PhpdocMenuType extends MenuType {
    name = name;

    public test(item: api.MenuItem): boolean {
        return item['phpdoc'] !== undefined;
    }

    public pre(item: api.MenuItem) {
        let { store, menus } = this.app;

        return item;
    }
}

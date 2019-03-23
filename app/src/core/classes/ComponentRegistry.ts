import React, { ComponentType } from 'react';
// noinspection ES6UnusedImports
import { cloneDeep, get, has, merge, set, unset } from 'lodash';

export interface RegistryItemOptions {
    tag?: boolean
    tagPrefix?: string
}

export interface RegistryItem<P = any> {
    id: string
    Component: ComponentType<P>
    options: RegistryItemOptions
}

const defaultRegistryItemOptions: Partial<RegistryItemOptions> = {
    tag   : true,
    tagPrefix: 'c-',
};

export class ComponentList<T extends RegistryItem = RegistryItem> extends Array<T> implements Array<T> {
    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    findBy(path: string, value: any): T | undefined { return this.find(item => get(item, path) === value); }

    filterBy(path: string, value: any): T[] { return this.filter(item => get(item, path) === value); }

    filterNotBy(path: string, value: any): T[] { return this.filter(item => get(item, path) !== value); }

    has(id: string) { return this.get(id) !== undefined; }

    get(id: string) { return this.findBy('id', id); }

    add(id: string, Component: ComponentType<any>, options: RegistryItemOptions = {}, override: boolean = false) {
        options     = { ...defaultRegistryItemOptions, ...options };
        let item: T = { id, Component, options } as T;
        this.push(item);
        return this;
    }

    getPrefixed(id: string) { return this.find(item => id == item.options.tagPrefix + item.id); }

    hasPrefixed(id: string) { return this.getPrefixed(id) !== undefined; }
}


export class ComponentRegistry {
    protected items: ComponentList = new ComponentList();

    registerMap(map: Record<string, React.ComponentType>, options: RegistryItemOptions = {}) {
        let keys = Object.keys(map);
        keys.forEach(key => {
            this.register(key, map[ key ], options);
        });
        return this;
    }

    register<P>(id: string, Component: ComponentType<P>, options: RegistryItemOptions = {}, override: boolean = false) {
        this.items.add(id, Component, options, override);
        return this;
    }

    has(id: string) {return this.items.has(id); }

    get(id: string) { return this.items.get(id); }

    all() {return this.items; }
}

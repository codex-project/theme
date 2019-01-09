import { injectable } from 'inversify';
import { Application } from '../classes/Application';
import { app } from '../ioc';
import { MenuItem } from '@codex/api';
import { MenuItems } from './MenuItems';


@injectable()
export abstract class MenuType implements IMenuType {
    name = this.constructor.name

    get app(): Application { return app; }

    abstract test(item: MenuItem): boolean

    handle(item: MenuItem, event: any, items: MenuItems) {

    }

    pre(item: MenuItem) {
        return item;
    }

    post(item: MenuItem) {
        return item;
    }
}

export interface IMenuType {
    name: string

    test(item: MenuItem): boolean

    handle(item: MenuItem, event: any, items: MenuItems): void | any

    pre(item: MenuItem): MenuItem

    post(item: MenuItem): MenuItem
}

export interface IMenuTypeConstructor {
    new(...params: any[]): IMenuType
}

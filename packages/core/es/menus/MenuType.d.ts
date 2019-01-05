import { Application } from 'classes/Application';
import { MenuItem } from '@codex/api';
import { MenuItems } from './MenuItems';
export declare abstract class MenuType implements IMenuType {
    name: string;
    readonly app: Application;
    abstract test(item: MenuItem): boolean;
    handle(item: MenuItem, event: any, items: MenuItems): void;
    pre(item: MenuItem): MenuItem;
    post(item: MenuItem): MenuItem;
}
export interface IMenuType {
    name: string;
    test(item: MenuItem): boolean;
    handle(item: MenuItem, event: any, items: MenuItems): void | any;
    pre(item: MenuItem): MenuItem;
    post(item: MenuItem): MenuItem;
}
export interface IMenuTypeConstructor {
    new (...params: any[]): IMenuType;
}

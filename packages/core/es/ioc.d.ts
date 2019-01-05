import 'reflect-metadata';
import { Application } from './classes/Application';
import { interfaces } from 'inversify';
declare const app: Application;
declare const lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
declare function singleton<T>(identifier: any, alias?: string, custom?: (binding: interfaces.BindingWhenOnSyntax<T>) => void): (target: any) => any;
export { app, lazyInject, singleton };

import { IDefinedRoute } from 'interfaces';
import { History } from 'history';
export declare class Routes<T extends IDefinedRoute = IDefinedRoute> extends Array<T> implements Array<T> {
    history: History;
    constructor(...items: T[]);
    getCurrentRoute(): T | undefined;
    addRoutes(...routes: T[]): void;
    generatePath(pattern: string, params?: {
        [paramName: string]: string | number | boolean;
    }): string;
    findBy(key: string, value: any): T | undefined;
    where(key: string, value: any): Routes<T>;
    rfilter(predicate: (value: T, index: number, obj: T[]) => boolean): Routes<T>;
    rfind(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined;
}

import { LinkData, Route } from 'routing';

export abstract class BaseRoute implements Route {
    public static id: string;

    public get name(): string {return this.constructor[ 'id' ];}

    public path: string;

    public link(params: any = {}, overrides: any = {}): LinkData {
        return {
            name: this.name,
            params,
            ...overrides,
        };
    }

}

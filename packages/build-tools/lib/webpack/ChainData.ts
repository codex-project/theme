import { get, has, merge, set, unset } from 'lodash';

export class ChainData {
    //@ts-ignore
    public data: any = {};

    public get<T extends any>(path: string, defaultValue?: any): T {
        return get(this['data'], path, defaultValue) as any;
    };

    public set(path: string, value: any): this {
        set(this['data'], path, value);
        return this;
    };

    public has(path: string): boolean {
        return has(this['data'], path);
    };

    public unset(path: string): this {
        unset(this['data'], path);
        return this;
    };

    public merge(data: any): this {
        merge(this['data'], data);
        return this;
    };
}

// ChainData.prototype['data'] = {}

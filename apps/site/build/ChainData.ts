// import { get, has, merge, set, unset } from 'lodash-es';

export declare const get:any,set:any,has:any,unset:any,merge:any;

export class ChainData {

    public get<T extends any>(path: string, defaultValue?: any): T {
        return get(this['data'], path, defaultValue) as any;
    }

    public set(path: string, value: any): this {
        set(this['data'], path, value);
        return this;
    }

    public has(path: string): boolean {
        return has(this['data'], path);
    }

    public unset(path: string): this {
        unset(this['data'], path);
        return this;
    }

    public merge(data: any): this {
        merge(this['data'], data);
        return this;
    }
}

// ChainData.prototype['data'] = {}

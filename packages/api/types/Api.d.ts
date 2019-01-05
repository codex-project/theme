import { GraphQLClient } from 'graphql-request';
import { Options, Variables } from 'graphql-request/dist/src/types';
import { Query } from './types';
import { SyncHook } from 'tapable';
export declare class Api extends GraphQLClient {
    readonly hooks: {
        query: SyncHook<{
            query: string;
            variables: Variables;
        }>;
        queryResult: SyncHook<any>;
    };
    constructor();
    setUrl(url: string): this;
    setOptions(options: Options): this;
    query(query: string, variables?: Variables): Promise<Query>;
}

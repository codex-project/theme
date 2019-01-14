import { ApiHeaders, ApiOptions, GraphQLError, GraphQLRequestContext, GraphQLResponse, Variables } from './types';
import { SyncHook } from 'tapable';
import { Query } from './generated';
export interface ApiResponse extends GraphQLResponse<Query> {
    errors?: GraphQLError[];
}
export declare class Api {
    readonly hooks: {
        query: SyncHook<{
            query: string;
            variables: Variables;
        }, any, any>;
        queryResult: SyncHook<any, any, any>;
    };
    protected options: ApiOptions;
    constructor();
    configure(options: Partial<ApiOptions>, _merge?: boolean): this;
    query(query: string, variables?: Variables, options?: Partial<ApiOptions>): Promise<ApiResponse>;
    protected request<T>(request: GraphQLRequestContext, options?: Partial<ApiOptions>): Promise<any>;
    protected batched(requestMap: Record<string, GraphQLRequestContext>, options?: Partial<ApiOptions>): Promise<any>;
    setHeaders(headers: ApiHeaders): this;
    setHeader(key: string, value: string): this;
    protected getResult(response: Response): Promise<any>;
}

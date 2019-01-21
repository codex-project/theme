import { ApiOptions, GraphQLRequestContext, Variables } from './types';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import { ContentResponse } from './ContentResponse';
import { BatchMapResult, BatchResult, FetchResult } from './results';
export declare class Api {
    readonly hooks: {
        query: SyncHook<GraphQLRequestContext, any, any>;
        queryResult: SyncWaterfallHook<FetchResult, any, any>;
        queryBatch: SyncHook<GraphQLRequestContext[], any, any>;
        queryBatchResult: SyncWaterfallHook<BatchResult, any, any>;
        queryMapBatch: SyncHook<Record<string, GraphQLRequestContext>, any, any>;
        queryMapBatchResult: SyncWaterfallHook<BatchMapResult, any, any>;
    };
    protected options: ApiOptions;
    constructor();
    configure(options: Partial<ApiOptions>, _merge?: boolean): this;
    query(query: string, variables?: Variables, options?: Partial<ApiOptions>): Promise<FetchResult>;
    queryBatch(requests: GraphQLRequestContext[], options?: Partial<ApiOptions>): Promise<BatchResult>;
    queryMapBatch(requestMap: Record<string, GraphQLRequestContext>, options?: Partial<ApiOptions>): Promise<BatchMapResult>;
    protected fetch(request: GraphQLRequestContext, options?: Partial<ApiOptions>): Promise<FetchResult>;
    protected batch(requests: GraphQLRequestContext[], options?: Partial<ApiOptions>): Promise<BatchResult>;
    protected batchMap(requestMap: Record<string, GraphQLRequestContext>, options?: Partial<ApiOptions>): Promise<BatchMapResult>;
    setHeader(key: string, value: string): this;
    protected getContent<T>(response: Response): Promise<T>;
    protected request<T>(body: string, options?: Partial<ApiOptions>): Promise<ContentResponse<T>>;
}

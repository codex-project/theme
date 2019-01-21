import { GraphQLBatchedResponse, GraphQLError, GraphQLRequestContext, GraphQLResponse } from './types';
import { Query } from './generated';
import { ContentResponse } from './ContentResponse';
export declare class Result<DATA, CONTENT> {
    response: ContentResponse<CONTENT>;
    request: GraphQLRequestContext | GraphQLRequestContext[];
    errors: GraphQLError[];
    data: DATA;
    constructor(response: ContentResponse<CONTENT>, request: GraphQLRequestContext | GraphQLRequestContext[]);
    readonly ok: boolean;
    readonly status: number;
    readonly headers: Headers;
    hasErrors(): boolean;
}
export declare class FetchResult extends Result<Partial<Query>, GraphQLResponse> {
    constructor(response: ContentResponse<GraphQLResponse>, request: GraphQLRequestContext);
}
export declare class BatchResult extends Result<GraphQLBatchedResponse, GraphQLBatchedResponse> {
    constructor(response: ContentResponse<GraphQLBatchedResponse>, request: GraphQLRequestContext[]);
}
export declare class BatchMapResult extends Result<Record<string, GraphQLBatchedResponse>, GraphQLBatchedResponse> {
    constructor(map: Record<string, GraphQLRequestContext>, response: ContentResponse<GraphQLBatchedResponse>, request: GraphQLRequestContext[]);
}

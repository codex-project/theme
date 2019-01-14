import { GraphQLRequestContext, GraphQLResponse } from './types';
export declare class ClientError<T> extends Error {
    response: GraphQLResponse<T>;
    request: GraphQLRequestContext | GraphQLRequestContext[];
    constructor(response: GraphQLResponse<T>, request: GraphQLRequestContext | GraphQLRequestContext[]);
    private static extractMessage;
}

import { GraphQLRequestContext } from './types';
import { Result } from './results';
export declare class ApiError extends Error {
    result: Result<any, any>;
    request: GraphQLRequestContext | GraphQLRequestContext[];
    constructor(result: Result<any, any>, request: GraphQLRequestContext | GraphQLRequestContext[]);
    private static extractMessage;
}

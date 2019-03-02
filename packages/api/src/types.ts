import { Query } from './generated';

export declare type Variables = {
    [ key: string ]: any;
};

export interface ApiHeaders {
    [ key: string ]: string;
}

export interface ApiOptions {
    url?: string
    method?: RequestInit['method'];
    headers?: ApiHeaders;
    mode?: RequestInit['mode'];
    credentials?: RequestInit['credentials'];
    cache?: RequestInit['cache'];
    redirect?: RequestInit['redirect'];
    referrer?: RequestInit['referrer'];
    referrerPolicy?: RequestInit['referrerPolicy'];
    integrity?: RequestInit['integrity'];
    signal?: RequestInit['signal'];
}


export type GraphQLResponse = {
    data?: Query;
    errors?: GraphQLError[];
}
export type GraphQLBatchedResponse = Array<GraphQLResponse>

export interface GraphQLError {
    message: string;
    locations: {
        line: number;
        column: number;
    }[];
    path: string[];
}

export interface GraphQLRequestContext {
    query: string;
    variables?: Variables;
}

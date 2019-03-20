import { GraphQLBatchedResponse, GraphQLError, GraphQLRequestContext, GraphQLResponse } from './types';
import { Query } from './generated';
import { ContentResponse } from './ContentResponse';

export class Result<DATA extends any=any, CONTENT extends any=any> {
    errors: GraphQLError[] = [];
    data: DATA;

    constructor(public response: ContentResponse<CONTENT>, public request: GraphQLRequestContext | GraphQLRequestContext[]) {}

    get ok(): boolean { return this.response.ok; }

    get status(): number { return this.response.status; }

    get headers(): Headers { return this.response.headers; }

    hasErrors(): boolean { return this.errors.length > 0;}
}

export class FetchResult extends Result<Partial<Query>, GraphQLResponse> {
    constructor(response: ContentResponse<GraphQLResponse>, request: GraphQLRequestContext) {
        super(response, request);
        this.data = response.content.data || {};
        if ( response.content.errors && response.content.errors.length > 0 ) {
            this.errors.push(...response.content.errors);
        }
    }
}

export class BatchResult extends Result<GraphQLBatchedResponse, GraphQLBatchedResponse> {
    constructor(response: ContentResponse<GraphQLBatchedResponse>, request: GraphQLRequestContext[]) {
        super(response, request);
        this.data = response.content || [];
        this.data.forEach(result => {
            if ( result.errors && result.errors.length > 0 ) {
                this.errors.push(...result.errors);
            }
        });
    }
}


export class BatchMapResult extends Result<Record<string, GraphQLResponse>, GraphQLBatchedResponse> {
    constructor(map: Record<string, GraphQLRequestContext>, response: ContentResponse<GraphQLBatchedResponse>, request: GraphQLRequestContext[]) {
        super(response, request);
        this.data = {};
        (response as any).content = response.content || [];
        Object.keys(map).forEach((key,i) => {
            this.data[key] = response.content[i] as any
        })

        response.content.forEach(result => {
            if ( result.errors && result.errors.length > 0 ) {
                this.errors.push(...result.errors);
            }
        });
    }
}


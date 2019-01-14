import { GraphQLBatchedResponse, GraphQLError, GraphQLResponse } from './types';
import { Query } from './generated';
import { ContentResponse } from './ContentResponse';

export class Result<DATA, CONTENT> {
    errors: GraphQLError[] = [];
    data: DATA;

    constructor(public response: ContentResponse<CONTENT>) {}

    get ok(): boolean { return this.response.ok; }

    get status(): number { return this.response.status; }

    get headers(): Headers { return this.response.headers; }

    hasErrors(): boolean { return this.errors.length > 0;}
}

export class FetchResult extends Result<Partial<Query>, GraphQLResponse> {
    constructor(response: ContentResponse<GraphQLResponse>) {
        super(response);
        this.data = response.content.data || {};
        if ( response.content.errors && response.content.errors.length > 0 ) {
            this.errors.push(...response.content.errors);
        }
    }
}

export class BatchResult extends Result<GraphQLBatchedResponse, GraphQLBatchedResponse> {
    constructor(response: ContentResponse<GraphQLBatchedResponse>) {
        super(response);
        this.data = response.content || [];
        this.data.forEach(result => {
            if ( result.errors && result.errors.length > 0 ) {
                this.errors.push(...result.errors);
            }
        });
    }
}


// noinspection ES6UnusedImports
import { ApiHeaders, ApiOptions, GraphQLBatchedResponse, GraphQLError, GraphQLRequestContext, GraphQLResponse, Variables } from './types';
import { merge } from 'lodash';
import { SyncHook, SyncWaterfallHook } from 'tapable';
import { ContentResponse } from './ContentResponse';
import { BatchMapResult, BatchResult, FetchResult } from './results';
import { ApiError } from './ApiError';


export class Api {
    public readonly hooks         = {
        query           : new SyncHook<GraphQLRequestContext>([ 'request' ]),
        queryResult     : new SyncWaterfallHook<FetchResult>([ 'result' ]),
        queryBatch      : new SyncHook<GraphQLRequestContext[]>([ 'requests' ]),
        queryBatchResult: new SyncWaterfallHook<BatchResult>([ 'result' ]),
        queryMapBatch      : new SyncHook<Record<string, GraphQLRequestContext>>([ 'requests' ]),
        queryMapBatchResult: new SyncWaterfallHook<BatchMapResult>([ 'result' ]),
    };
    protected options: ApiOptions = {
        url    : '/graphql',
        headers: { 'Content-Type': 'application/json' },
        method : 'POST',
    };

    constructor() { }

    configure(options: Partial<ApiOptions>, _merge = true) {
        if ( _merge ) {
            merge(this.options, options);
        } else {
            this.options = options;
        }
        return this;
    }

    async query(query: string, variables: Variables = {}, options: Partial<ApiOptions> = {}) {
        let request = { query, variables };
        this.hooks.query.call(request);
        let result = await this.fetch(request, options);
        result     = this.hooks.queryResult.call(result);
        return result;
    }

    async queryBatch(requests: GraphQLRequestContext[], options: Partial<ApiOptions> = {}) {
        this.hooks.queryBatch.call(requests);
        let result = await this.batch(requests, options);
        result     = this.hooks.queryBatchResult.call(result);
        return result;
    }

    async queryMapBatch(requestMap: Record<string, GraphQLRequestContext>, options: Partial<ApiOptions> = {}) {
        this.hooks.queryMapBatch.call(requestMap);
        let result = await this.batchMap(requestMap, options);
        result     = this.hooks.queryMapBatchResult.call(result);
        return result;
    }

    protected async fetch(request: GraphQLRequestContext, options: Partial<ApiOptions> = {}) {
        const response = await this.request<GraphQLResponse>(makeBody(request), options);
        const result   = new FetchResult(response, request);
        if ( result.status >= 200 && result.status < 400 && ! result.hasErrors() ) {
            return result;
        }

        throw new ApiError(result, request);
    }


    protected async batch(requests: GraphQLRequestContext[], options: Partial<ApiOptions> = {}) {
        const response            = await this.request<GraphQLBatchedResponse>(makeBody(requests), options);
        const result: BatchResult = new BatchResult(response, requests);
        if ( result.status >= 200 && result.status < 400 && ! result.hasErrors() ) {
            return result;
        }

        throw new ApiError(result, requests);
    }

    protected async batchMap(requestMap: Record<string, GraphQLRequestContext>, options: Partial<ApiOptions> = {}) {
        let requests                 = Object.values(requestMap);
        const response               = await this.request<GraphQLBatchedResponse>(makeBody(requests), options);
        const result: BatchMapResult = new BatchMapResult(requestMap, response, requests);
        if ( result.status >= 200 && result.status < 400 && ! result.hasErrors() ) {
            return result;
        }

        throw new ApiError(result, requests);
    }

    setHeader(key: string, value: string): this {
        const { headers } = this.options;

        if ( headers ) {
            headers[ key ] = value;
        } else {
            this.options.headers = { [ key ]: value };
        }
        return this;
    }

    protected async getContent<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('Content-Type');
        if ( contentType && contentType.startsWith('application/json') ) {
            return response.json();
        }
        return response.text() as any;
    }

    protected async request<T>(body: string, options: Partial<ApiOptions> = {}): Promise<ContentResponse<T>> {
        options              = merge({}, this.options, options);
        let { url, ...rest } = options;
        let response         = await fetch(url, { body, ...rest });
        let content          = await this.getContent<T>(response);

        return new ContentResponse(response, content);
    }

}


function makeBody(request: GraphQLRequestContext | GraphQLRequestContext[]): string {
    return JSON.stringify(request);
}

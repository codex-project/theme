// noinspection ES6UnusedImports
import { ClientError, GraphQLClient, rawRequest, request } from 'graphql-request'
import { Options, Variables } from 'graphql-request/dist/src/types';
import { merge } from 'lodash';
import { Query } from './types';
import { SyncHook } from 'tapable';

export class Api extends GraphQLClient {

    public readonly hooks: {
        query: SyncHook<{ query: string, variables: Variables }>
        queryResult: SyncHook<any>
    } = {
        query      : new SyncHook<{ query: string, variables: Variables }>([ 'request' ]),
        queryResult: new SyncHook<any>([ 'result' ])
    }

    constructor() {
        super('', {});
    }

    setUrl(url: string) {
        this[ 'url' ] = url;
        return this;
    }

    setOptions(options: Options) {
        merge(this[ 'options' ], options);
        return this;
    }

    query(query: string, variables: Variables = {}) {
        let request = { query, variables };
        this.hooks.query.call(request)
        let result = this.request<Query>(request.query, request.variables);
        this.hooks.queryResult.call(result);
        return result;
    }
}

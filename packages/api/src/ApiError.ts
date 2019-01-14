import { GraphQLRequestContext } from './types';
import { Result } from './results';

export class ApiError extends Error {
    constructor(public result: Result<any, any>, public request: GraphQLRequestContext | GraphQLRequestContext[]) {
        super(ApiError.extractMessage(result));
        if ( typeof Error[ 'captureStackTrace' ] === 'function' ) {
            Error[ 'captureStackTrace' ](this, ApiError);
        }
    }

    private static extractMessage(result: Result<any, any>): string {
        try {
            return result.errors![ 0 ].message;
        } catch ( e ) {
            return `GraphQL Error (Code: ${result.status})`;
        }
    }
}

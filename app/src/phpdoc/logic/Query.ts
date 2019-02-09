import { strEnsureLeft, strStripLeft } from '@codex/core';
import { isBoolean, isString, isUndefined } from 'lodash';
import { FQSEN } from './FQSEN';

const log = require('debug')('phpdoc:logic:Query');

export type QueryMemberType = null | 'property' | 'method' | 'constant';

export class Query {
    static prefix: string = '#!/';

    fqsen: FQSEN;
    isValid: boolean;

    constructor(public fullName: string) {
        this.update(fullName);
    }

    protected reset() {
        this.fqsen    = null;
        this.isValid = true;
    }

    /**
     * Updates all properties using the new fullName. If fullName is not given, the window.location.hash will be used to update.
     *
     * @param {string} fullName
     * @returns {this}
     */
    update(fullName?: string): this {
        this.reset();
        fullName     = fullName || window.location.hash;
        this.isValid = Query.isValid(fullName);
        if ( ! this.isValid ) {
            return this;
        }
        fullName  = Query.stripPrefix(fullName);
        this.fqsen = FQSEN.from(fullName);
        return this;
    }

    static stripPrefix(value: string) {return strStripLeft(value, Query.prefix); }

    static ensurePrefix(value: string) {return strEnsureLeft(value, Query.prefix); }

    static isValid(target: Query | string): boolean {
        if ( isUndefined(target) ) {
            return false;
        }
        if ( ! isUndefined((target as Query).isValid) && isBoolean((target as Query).isValid) ) {
            return (target as Query).isValid;
        }
        if ( ! isString(target) || target.length === 0 ) {
            return false;
        }
        return true;
    }

    static from(fullName: string): Query
    static from(entityName: string, memberSignature: string): Query
    static from(entityName: string, memberType: QueryMemberType, memberName: string): Query
    static from(...args: any[]): Query {
        let fqsen: FQSEN = (FQSEN.from as any)(...args);
        return new Query(fqsen.toString());
    }

    static fromHash(): Query { return Query.from(window.location.hash);}

    static isValidHash(hash: string) { return hash.startsWith(Query.prefix) && strStripLeft(strStripLeft(hash, Query.prefix), '\\').length > 0 && (new Query(hash)).isValid; }

    toHash(): string {return strEnsureLeft(this.fullName, Query.prefix); }

    toString() {return this.fullName;}

}

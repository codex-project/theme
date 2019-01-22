import { strEnsureLeft, strEnsureRight, strStripLeft, strStripRight } from '@codex/core';
import { isBoolean, isString, isUndefined, last } from 'lodash';

const log = require('debug')('phpdoc:logic:FQNS');

export type FQNSMemberType = null | 'property' | 'method' | 'constant';

export class FQNS {

    name: string;
    entityName: string;
    slashEntityName: string;
    isEntity: boolean;
    isMember: boolean;
    memberName: string;
    memberSignature: string;
    memberType: FQNSMemberType;
    isMethod: boolean;
    isProperty: boolean;
    isConstant: boolean;
    isValid: boolean;

    constructor(public fullName: string) {
        this.update(fullName);
    }

    protected reset() {
        this.name            = null;
        this.entityName      = null;
        this.slashEntityName = null;
        this.isEntity        = false;
        this.isMember        = false;
        this.memberName      = null;
        this.memberSignature = null;
        this.memberType      = null;
        this.isMethod        = false;
        this.isProperty      = false;
        this.isConstant      = false;
        this.isValid         = true;
    }

    /**
     * Updates all properties using the new fullName.
     *
     * @param {string} fullName
     * @returns {this}
     */
    update(fullName: string): this {
        this.reset();
        this.fullName = FQNS.replaceDoubleSlash(fullName);
        this.isValid  = FQNS.isValidFullName(this.fullName);
        if ( ! this.isValid ) {
            return this;
        }
        this.fullName = FQNS.ensureStartSlash(this.fullName);

        if ( this.fullName.indexOf('::') !== - 1 ) {
            this.entityName = this.fullName.split('::')[ 0 ];
            this.isMember   = true;

            this.memberSignature = this.fullName.split('::')[ 1 ];
            this.memberType      = FQNS.memberSignatureType(this.memberSignature);
            this.memberName      = FQNS.cleanMemberSignature(this.memberSignature);

            this.isProperty = this.memberType === 'property';
            this.isMethod   = this.memberType === 'method';
            this.isConstant = this.memberType === 'constant';

        } else {
            this.entityName = this.fullName;
            this.isEntity   = true;
        }
        this.entityName      = FQNS.stripStartSlash(FQNS.replaceDoubleSlash(this.entityName));
        this.slashEntityName = FQNS.ensureStartSlash(FQNS.replaceDoubleSlash(this.entityName));
        this.name            = FQNS.stripNamespace(this.entityName);
        return this;
    }

    toString() {return this.fullName;}

    equals(other: string | FQNS): boolean {
        return this.fullName === FQNS.from(other).fullName;
    }

    static ensureStartSlash(value: string): string { return strEnsureLeft(value, '\\'); }

    static replaceDoubleSlash(value: string): string {return value.replace(/\\\\/g, '\\');}

    static stripStartSlash(value: string): string {
        let hasSlash = value.startsWith('\\');
        while ( hasSlash ) {
            value    = strStripLeft(value, '\\');
            hasSlash = value.startsWith('\\');
        }
        return value;
    }

    static isValidFullName(target: FQNS | string): boolean {
        if ( isUndefined(target) ) {
            return false;
        }
        if ( ! isUndefined((target as FQNS).isValid) && isBoolean((target as FQNS).isValid) ) {
            return (target as FQNS).isValid;
        }
        if ( ! isString(target) || target.length === 0 ) {
            return false;
        }
        return true;
    }

    static memberSignatureType(signature: string): FQNSMemberType {
        signature = <any>signature;
        return signature.startsWith('$') ? 'property' : signature.endsWith('()') ? 'method' : 'constant';
    }

    /**
     * returns the clean member name
     *
     * @param {string} signature
     * @returns {string}
     */
    static cleanMemberSignature(signature: string): string {
        signature = strStripRight(signature, '()');
        signature = strStripLeft(signature, '$');
        return signature;
    }

    /**
     * Returns the decorated member signature
     * @param {FQNSMemberType} type
     * @param {string} signature
     * @returns {string}
     */
    static decorateMemberName(type: FQNSMemberType, signature: string): string {
        if ( type === 'method' ) {return strEnsureRight(signature, '()'); }
        if ( type === 'property' ) {return strEnsureLeft(signature, '$'); }
        return signature;
    }

    static from(fullName: string | FQNS): FQNS
    static from(entityName: string, memberSignature: string): FQNS
    static from(entityName: string, memberType: FQNSMemberType, memberName: string): FQNS
    static from(...args: any[]): FQNS {
        let len = args.length;
        if ( len === 1 ) {
            return new FQNS(args[ 0 ].toString());
        } else if ( len === 2 ) {
            let entityName      = args[ 0 ];
            let memberSignature = args[ 1 ];
            return new FQNS(`${entityName}::${memberSignature}`);
        }
        let entityName      = args[ 0 ];
        let memberType      = args[ 1 ];
        let memberName      = args[ 2 ];
        let memberSignature = FQNS.decorateMemberName(memberType, memberName);
        return new FQNS(`${entityName}::${memberSignature}`);
    }

    static stripNamespace(value: string): string { return last(value.split('\\')); }
}

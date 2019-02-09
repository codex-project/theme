import { strEnsureLeft, strEnsureRight, strStripLeft, strStripRight } from '@codex/core';
import { isBoolean, isString, isUndefined, last } from 'lodash';

const log = require('debug')('phpdoc:logic:FQNS');

export type FQNSMemberType = null | 'property' | 'method' | 'constant';

export class FQSEN {
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
        this.fullName = FQSEN.replaceDoubleSlash(fullName);
        this.isValid  = FQSEN.isValidFullName(this.fullName);
        if ( ! this.isValid ) {
            return this;
        }
        this.fullName = FQSEN.ensureStartSlash(this.fullName);

        if ( this.fullName.indexOf('::') !== - 1 ) {
            this.entityName = this.fullName.split('::')[ 0 ];
            this.isMember   = true;

            this.memberSignature = this.fullName.split('::')[ 1 ];
            this.memberType      = FQSEN.memberSignatureType(this.memberSignature);
            this.memberName      = FQSEN.cleanMemberSignature(this.memberSignature);

            this.isProperty = this.memberType === 'property';
            this.isMethod   = this.memberType === 'method';
            this.isConstant = this.memberType === 'constant';

        } else {
            this.entityName = this.fullName;
            this.isEntity   = true;
        }
        this.entityName      = FQSEN.stripStartSlash(FQSEN.replaceDoubleSlash(this.entityName));
        this.slashEntityName = FQSEN.ensureStartSlash(FQSEN.replaceDoubleSlash(this.entityName));
        this.name            = FQSEN.stripNamespace(this.entityName);
        return this;
    }

    toString() {return this.fullName;}

    equals(other: string | FQSEN): boolean {
        return this.fullName === FQSEN.from(other).fullName;
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

    static isValidFullName(target: FQSEN | string): boolean {
        if ( isUndefined(target) ) {
            return false;
        }
        if ( ! isUndefined((target as FQSEN).isValid) && isBoolean((target as FQSEN).isValid) ) {
            return (target as FQSEN).isValid;
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

    static from(fullName: string | FQSEN): FQSEN
    static from(entityName: string, memberSignature: string): FQSEN
    static from(entityName: string, memberType: FQNSMemberType, memberName: string): FQSEN
    static from(...args: any[]): FQSEN {
        let len = args.length;
        if ( len === 1 ) {
            return new FQSEN(args[ 0 ].toString());
        } else if ( len === 2 ) {
            let entityName      = args[ 0 ];
            let memberSignature = args[ 1 ];
            return new FQSEN(`${entityName}::${memberSignature}`);
        }
        let entityName      = args[ 0 ];
        let memberType      = args[ 1 ];
        let memberName      = args[ 2 ];
        let memberSignature = FQSEN.decorateMemberName(memberType, memberName);
        return new FQSEN(`${entityName}::${memberSignature}`);
    }

    static stripNamespace(value: string): string { return last(value.split('\\')); }
}

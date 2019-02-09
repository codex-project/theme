/*
 * Copyright (c) 2018. Codex Project
 *
 * The license can be found in the package and online at https://codex-project.mit-license.org.
 *
 * @copyright 2018 Codex Project
 * @author Robin Radic
 * @license https://codex-project.mit-license.org MIT License
 */

import { Query } from './Query';
import { PhpdocManifest } from './PhpdocStore';
import { PhpdocManifestFile } from '@codex/api';
import { FQSEN } from './FQSEN';
import { strStripRight } from '@codex/core';

export class Type {
    static primitives    = [ 'boolean', 'integer', 'float', 'string', 'array', 'object', 'callable', 'iterable', 'resource', 'null', 'mixed', 'void' ];
    fqsen: FQSEN;
    type: string;
    fullName: string;
    entityName: string;
    isEntity: boolean    = false;
    isPrimitive: boolean = false;
    isLocal: boolean     = false;
    isExternal: boolean  = false;
    isArray: boolean     = false;
    cssClass: string;
    protected entity: PhpdocManifestFile;

    constructor(protected manifest: PhpdocManifest, fullName: string) {
        this.isArray = Type.isArray(fullName);
        if ( this.isArray ) {
            fullName = strStripRight(fullName, '[]');
        }
        this.fqsen             = FQSEN.from(fullName);
        this.fullName         = this.fqsen.fullName;
        this.entityName       = this.fqsen.entityName;
        this.isPrimitive      = Type.primitives.includes(fullName);
        this.isEntity         = this.isPrimitive ? false : this.fqsen.isEntity;
        this.type             = this.isPrimitive ? 'primitive' : 'class';
        this.isLocal          = false;
        this.isExternal       = false;
        let classes: string[] = [];


        if ( this.isEntity ) {
            this.isExternal = true;
            if ( manifest ) {
                this.isLocal    = manifest.files.has(this.fullName);
                this.isExternal = ! this.isLocal;
                if ( this.isLocal ) {
                    this.entity = manifest.files.get(this.fullName);
                    this.type   = this.entity.type;
                }
            }
            classes.push('phpdoc-type-' + (this.isLocal ? this.entity.type : 'external'));
        } else {
            classes.push('phpdoc-type-simple');
            classes.push('phpdoc-type-simple-' + this.type);
        }
        this.cssClass = classes.join(' ');
    }

    static isArray(fullName: string) {return fullName.endsWith('[]'); }

    toQuery(): Query {
        return new Query(this.fullName);
    }

}

export default Type;

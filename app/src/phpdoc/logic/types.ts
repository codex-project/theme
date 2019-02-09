import { api } from '@codex/api';
import { Arguments, Methods, Properties, Tags } from './collections';
import { FQNS } from './FQNS';

export interface PhpdocDocblock extends api.PhpdocDocblock {
    tags: Tags
}

export interface PhpdocFile extends api.PhpdocFile {}

export class PhpdocFile {
    docblock: PhpdocDocblock;
    class: PhpdocClassFile;
    interface: PhpdocInterfaceFile;
    trait: PhpdocTraitFile;

    constructor(data: api.PhpdocFile) {
        Object.assign(this, data);
        if ( data.type === 'class' ) {
            this.class = new PhpdocClassFile(data.class);
        } else if ( data.type === 'interface' ) {
            this.interface = new PhpdocInterfaceFile(data.interface);
        } else if ( data.type === 'trait' ) {
            this.trait = new PhpdocTraitFile(data.trait);
        }
        if ( data.docblock && data.docblock.tags ) {
            this.docblock.tags = new Tags(...data.docblock.tags);
        }
    }

    get isClass(): boolean {return this.type === 'class';}

    get isInterface(): boolean {return this.type === 'interface';}

    get isTrait(): boolean {return this.type === 'trait';}

    get entity(): PhpdocClassFile | PhpdocTraitFile | PhpdocInterfaceFile { return this[ this.type ]; }

    get fqns(): FQNS { return this.entity.fqns; }
}


export abstract class PhpdocBaseType<T extends any> {
    constructor(data: T) {
        Object.assign(this, data);
    }
}

export abstract class PhpdocBaseFile<T extends any> extends PhpdocBaseType<T> {
    fqns: FQNS;

    constructor(public readonly type: 'class' | 'trait' | 'interface', data: T) {
        super(data);
        if ( data.methods ) {
            this[ 'methods' ] = new Methods(...data.methods.map(item => {
                if ( item.docblock && item.docblock.tags !== undefined ) {
                    item.docblock.tags = new Tags(...item.docblock.tags);
                }
                item.arguments = new Arguments(...item.arguments.map(argument => {
                    if ( ! argument.type ) {
                        argument.type  = 'mixed';
                    }
                    if ( ! argument.types ) {
                        argument.types  = argument.type.split('|')
                    }
                    return argument;
                }));
                return new PhpdocMethod(item);
            }));
        }
        if ( data.properties ) {
            this[ 'properties' ] = new Properties(...data.properties.map(item => {
                if ( item.docblock && item.docblock.tags !== undefined ) {
                    item.docblock.tags = new Tags(...item.docblock.tags);
                }
                return new PhpdocProperty(item);
            }));
        }
        if ( data.docblock && data.docblock.tags ) {
            this[ 'docblock' ][ 'tags' ] = new Tags(...data.docblock.tags);
        }
        if ( data.full_name ) {
            this.fqns = FQNS.from(data.full_name);
        }
    }
}

export interface PhpdocClassFile extends api.PhpdocClassFile {}

export class PhpdocClassFile extends PhpdocBaseFile<api.PhpdocClassFile> {
    docblock: PhpdocDocblock;
    methods: Methods<PhpdocMethod>;
    properties: Properties<PhpdocProperty>;

    constructor(data) {
        super('class', data);
    }
}

export interface PhpdocInterfaceFile extends api.PhpdocInterfaceFile {}

export class PhpdocInterfaceFile extends PhpdocBaseFile<api.PhpdocInterfaceFile> {
    docblock: PhpdocDocblock;
    methods: Methods<PhpdocMethod>;

    constructor(data) {
        super('interface', data);
    }
}

export interface PhpdocTraitFile extends api.PhpdocTraitFile {}

export class PhpdocTraitFile extends PhpdocBaseFile<api.PhpdocTraitFile> {
    docblock: PhpdocDocblock;
    methods: Methods<PhpdocMethod>;
    properties: Properties<PhpdocProperty>;

    constructor(data) {
        super('trait', data);
    }
}

export interface PhpdocMethod extends api.PhpdocMethod {}

export class PhpdocMethod extends PhpdocBaseType<api.PhpdocMethod> {
    docblock: PhpdocDocblock;
    arguments: Arguments;
    fqns: FQNS;
    type='method'

    constructor(data) {
        super(data);
        if ( data.full_name ) {
            this.fqns = FQNS.from(data.full_name);
        }
    }
}


export interface PhpdocProperty extends api.PhpdocProperty {}

export class PhpdocProperty extends PhpdocBaseType<api.PhpdocProperty> {
    docblock: PhpdocDocblock;
    fqns: FQNS;
    type='property'
    constructor(data) {
        super(data);
        if ( data.full_name ) {
            this.fqns = FQNS.from(data.full_name);
        }
    }
}


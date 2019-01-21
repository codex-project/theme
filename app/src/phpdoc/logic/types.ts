import { api } from '@codex/api';
import { Methods, Properties, Tags } from './collections';

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
}


export abstract class PhpdocBaseType<T extends any> {
    constructor(data: T) {
        Object.assign(this, data);
    }
}

export abstract class PhpdocBaseFile<T extends any> extends PhpdocBaseType<T> {

    constructor(public readonly type: 'class' | 'trait' | 'interface', data: T) {
        super(data);
        if ( data.methods ) {
            this[ 'methods' ] = new Methods(...data.methods);
        }
        if ( data.properties ) {
            this[ 'properties' ] = new Properties(...data.properties);
        }
        if ( data.docblock && data.docblock.tags ) {
            this[ 'docblock' ][ 'tags' ] = new Tags(...data.docblock.tags);
        }
    }
}

export interface PhpdocClassFile extends api.PhpdocClassFile {}

export class PhpdocClassFile extends PhpdocBaseFile<api.PhpdocClassFile> {
    docblock: PhpdocDocblock;
    methods: Methods;
    properties: Properties;

    constructor(data) {
        super('class', data);
    }
}

export interface PhpdocInterfaceFile extends api.PhpdocInterfaceFile {}

export class PhpdocInterfaceFile extends PhpdocBaseFile<api.PhpdocInterfaceFile> {
    docblock: PhpdocDocblock;
    methods: Methods;

    constructor(data) {
        super('interface', data);
    }
}

export interface PhpdocTraitFile extends api.PhpdocTraitFile {}

export class PhpdocTraitFile extends PhpdocBaseFile<api.PhpdocTraitFile> {
    docblock: PhpdocDocblock;
    methods: Methods;
    properties: Properties;

    constructor(data) {
        super('trait', data);
    }
}

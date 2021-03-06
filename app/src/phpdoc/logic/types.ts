import { api } from '@codex/api';
import { Arguments, Methods, Properties, Tags } from './collections';
import { FQSEN } from './FQSEN';
import { Map } from '@codex/core';

export class PhpdocMembers extends Map<string, PhpdocMember> {
    getMethods(): Map<string, PhpdocMethod> {
        return new PhpdocMethods(this.filter(member => member.isMethod()));
    }

    getProperties(): Map<string, PhpdocProperty> {
        return new PhpdocProperties(this.filter(member => member.isProperty()));
    }
}

export class PhpdocMethods extends Map<string, PhpdocMethod> {}

export class PhpdocProperties extends Map<string, PhpdocProperty> {}


export interface PhpdocDocblock extends api.PhpdocDocblock {
    tags: Tags
}

export interface PhpdocFile extends api.PhpdocFile {}

export class PhpdocFile<T extends PhpdocClassFile | PhpdocInterfaceFile | PhpdocTraitFile = PhpdocClassFile> {
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

    get entity(): T { return this[ this.type ]; }

    get fqsen(): FQSEN { return this.entity.fqsen; }
}


export abstract class PhpdocBaseType<T extends any> {
    toJS: () => T;

    isClass(): this is PhpdocClassFile {
        return this[ 'type' ] && this[ 'type' ] === 'class';
    }

    isInterface(): this is PhpdocInterfaceFile {
        return this[ 'type' ] && this[ 'type' ] === 'interface';
    }

    isTrait(): this is PhpdocTraitFile {
        return this[ 'type' ] && this[ 'type' ] === 'trait';
    }

    isMethod(): this is PhpdocMethod {
        return this[ 'type' ] && this[ 'type' ] === 'method';
    }

    isProperty(): this is PhpdocProperty {
        return this[ 'type' ] && this[ 'type' ] === 'property';
    }

    constructor(data: T) {
        Object.assign(this, data);
        this.toJS = () => data;
    }
}

export abstract class PhpdocBaseFile<T extends any> extends PhpdocBaseType<T> {
    fqsen: FQSEN;
    entity: T;
    members: PhpdocMembers;

    constructor(public readonly type: 'class' | 'trait' | 'interface', data: T) {
        super(data);
        this.fqsen   = FQSEN.from(data.full_name);
        this.members = new PhpdocMembers();
        if ( data.methods ) {
            this[ 'methods' ] = new Methods(...data.methods.map(item => {
                if ( item.docblock && item.docblock.tags !== undefined ) {
                    item.docblock.tags = new Tags(...item.docblock.tags);
                }
                item.arguments = new Arguments(...item.arguments.map(argument => {
                    if ( ! argument.type ) {
                        argument.type = 'mixed';
                    }
                    if ( ! argument.types ) {
                        argument.types = argument.type.split('|');
                    }
                    return argument;
                }));
                return new PhpdocMethod(item, this);
            }));

            this.members = this.members.withMutations(map => {
                this[ 'methods' ].getValues().forEach(value => {
                    map.set(value.name, value);
                });
            });
        }
        if ( data.properties ) {
            this[ 'properties' ] = new Properties(...data.properties.map(item => {
                if ( item.docblock && item.docblock.tags !== undefined ) {
                    item.docblock.tags = new Tags(...item.docblock.tags);
                }
                return new PhpdocProperty(item, this);
            }));

            this.members = this.members.withMutations(map => {
                this[ 'properties' ].getValues().forEach(value => {
                    map.set(value.name, value);
                });
            });
        }
        if ( data.docblock && data.docblock.tags ) {
            this[ 'docblock' ][ 'tags' ] = new Tags(...data.docblock.tags);
        }
    }
}

export interface PhpdocClassFile extends api.PhpdocClassFile {
    methods: Methods<PhpdocMethod>
    properties: Properties<PhpdocProperty>
}

export class PhpdocClassFile extends PhpdocBaseFile<api.PhpdocClassFile> {
    docblock: PhpdocDocblock;
    methods: Methods<PhpdocMethod>;
    properties: Properties<PhpdocProperty>;

    constructor(data) {
        super('class', data);
    }
}

export interface PhpdocInterfaceFile extends api.PhpdocInterfaceFile {
    methods: Methods<PhpdocMethod>
}

export class PhpdocInterfaceFile extends PhpdocBaseFile<api.PhpdocInterfaceFile> {
    docblock: PhpdocDocblock;
    methods: Methods<PhpdocMethod>;

    constructor(data) {
        super('interface', data);
    }
}

export interface PhpdocTraitFile extends api.PhpdocTraitFile {
    methods: Methods<PhpdocMethod>
    properties: Properties<PhpdocProperty>
}

export class PhpdocTraitFile extends PhpdocBaseFile<api.PhpdocTraitFile> {
    docblock: PhpdocDocblock;
    methods: Methods<PhpdocMethod>;
    properties: Properties<PhpdocProperty>;

    constructor(data) {
        super('trait', data);
    }
}

export interface PhpdocMethod extends api.PhpdocMethod {

    arguments: Arguments
    fqsen: FQSEN
    original_fqsen: FQSEN
    type: string
}

export class PhpdocMethod extends PhpdocBaseType<api.PhpdocMethod> {
    docblock: PhpdocDocblock;
    arguments: Arguments;
    fqsen: FQSEN;
    original_fqsen: FQSEN;
    type = 'method';

    get isInherited() { return this.inherited_from && this.inherited_from.length; }

    constructor(data, parent: PhpdocBaseFile<any>) {
        super(data);
        if ( data.full_name ) {
            this.original_fqsen = FQSEN.from(data.full_name);
            this.fqsen          = FQSEN.from(parent.fqsen.entityName, 'method', data.name);
        }
    }
}


export interface PhpdocProperty extends api.PhpdocProperty {
    fqsen: FQSEN
    original_fqsen: FQSEN
    type: string
}

export class PhpdocProperty extends PhpdocBaseType<api.PhpdocProperty> {
    docblock: PhpdocDocblock;
    fqsen: FQSEN;
    original_fqsen: FQSEN;
    type = 'property';

    get isInherited() { return this.inherited_from && this.inherited_from.length; }

    constructor(data, parent: PhpdocBaseFile<any>) {
        super(data);
        if ( data.full_name ) {
            this.original_fqsen = FQSEN.from(data.full_name);
            this.fqsen          = FQSEN.from(parent.fqsen.entityName, 'property', data.name);
            this.inherited_from = this.original_fqsen.entityName !== parent.fqsen.entityName ? this.original_fqsen.entityName : null;
        }
        if ( this.docblock.tags.has('var') ) {
            this.types = this.docblock.tags.get('var').types;
        }
        if ( ! this.types ) {
            this.types = [ 'mixed' ];
        }
    }
}

export type PhpdocMember = PhpdocProperty | PhpdocMethod

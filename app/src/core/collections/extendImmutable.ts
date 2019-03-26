import * as invariant from 'invariant';

const unwrappedMethods = [
    'constructor',
    'get',
    'getIn',
    'first',
    'last',
    'reduce',
    'reduceRight',
    'find',
    'findLast',
    'findEntry',
    'findLastEntry',
    'max',
    'maxBy',
    'min',
    'minBy',
    'clear', // Important! We're manually overriding this method
];

export function createExtendable(base, copy, empty) {
    const constructor = base.prototype.constructor;
    const name        = constructor.name;
    const proto       = Object.create(base.prototype);


    invariant(typeof copy === 'function',
        `${name}: \`copy\` is expected to be a function.`);
    invariant(typeof empty === 'function',
        `${name}: \`empty\` is expected to be a function.`);


    // Overrides the original clear method that returns an empty object
    proto.clear = function clear() {
        return this.__wrapImmutable({});
    };

    // Create a list of keys and values that hold the empty instances
    const emptyKeys   = [];
    const emptyValues = [];

    // A method for wrapping an immutable object, with reference equality for empty instances
    proto.__wrapImmutable = function __wrapImmutable(val, forceCreation = false) {
        const prototype       = Object.getPrototypeOf(this);
        const { constructor } = prototype;

        if ( ! val.size && ! val.__ownerID && ! forceCreation ) {
            const emptyIndex = emptyKeys.indexOf(prototype);
            if ( emptyIndex > - 1 ) {
                return emptyValues[ emptyIndex ];
            }

            // Create empty instance and store it
            const emptyInstance             = empty(Object.create(prototype));
            emptyValues[ emptyKeys.length ] = emptyInstance;
            emptyKeys.push(prototype);

            return emptyInstance;
        }

        return copy(Object.create(prototype), val);
    };

    // Methods which will yield a Map and have to be wrapped before returning a result
    for ( const key in base.prototype ) {
        if (
            ! key.startsWith('__') &&
            ! key.startsWith('to') &&
            unwrappedMethods.indexOf(key) === - 1
        ) {
            const _originalMethod = base.prototype[ key ];

            if ( typeof _originalMethod === 'function' ) {
                proto[ key ] = function wrappedMethod(...args) {
                    const res = _originalMethod.apply(this, args);

                    if (
                        res &&
                        typeof res === 'object' &&
                        Object.getPrototypeOf(res).constructor === constructor
                    ) {
                        return this.__wrapImmutable(res);
                    }

                    return res;
                };
            }
        }
    }

    proto.__ensureOwner = function __ensureOwner(ownerID) {
        if ( ownerID === this.__ownerID ) {
            return this;
        } else if ( ! ownerID ) {
            this.__ownerID = undefined;
            this.__altered = false;
            return this;
        }

        const res     = this.__wrapImmutable(this, true);
        res.__ownerID = ownerID;
        return res;
    };

    return proto;
}


export function extendable(Base) {
    const NAME      = Base.prototype.constructor.name;
    const emptyBase = new Base();

    let exampleBase;
    if ( emptyBase.add ) {
        exampleBase = emptyBase.add('a');
    } else if ( emptyBase.set ) {
        exampleBase = emptyBase.set('a', 'b');
    } else if ( emptyBase.push ) {
        exampleBase = emptyBase.push('a');
    } else {
        throw new Error(`extendable: \`${NAME}\` is not supported.`);
    }

    const KEYS  = Object.keys(exampleBase);
    const EMPTY = KEYS.reduce((acc, key) => {
        acc[ key ] = emptyBase[ key ];
        return acc;
    }, {});

    function copy(val, update) {
        return KEYS.reduce((acc, key) => {
            acc[ key ] = update[ key ];
            return acc;
        }, val);
    }

    function empty(val) {
        return Object
            .keys(EMPTY)
            .reduce((acc, key) => {
                acc[ key ] = EMPTY[ key ];
                return acc;
            }, val);
    }

    function ExtendableWrapper(val): void {
        let instance: any = this;
        if ( instance === undefined ) {
            instance = new ExtendableWrapper(val as any) as any;
        }

        return instance.__wrapImmutable(new Base(val));
    }

    ExtendableWrapper[ 'is' + NAME ] = function is(obj) {
        return obj && obj instanceof ExtendableWrapper;
    };

    ExtendableWrapper.prototype             = createExtendable(Base, copy, empty);
    ExtendableWrapper.prototype.constructor = ExtendableWrapper;

    ExtendableWrapper.prototype.toString = function toString() {
        return 'Extendable.' + Base.prototype.toString.call(this);
    };

    return ExtendableWrapper;
}



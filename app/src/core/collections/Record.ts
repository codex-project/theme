import * as Immutable from 'immutable';



export interface Record<K, V> extends Immutable.Collection.Keyed<K, V> {

    // Persistent changes

    /**
     * Returns a new Record also containing the new key, value pair. If an equivalent
     * key already exists in this Record, it will be replaced.
     */
    set(key: K, value: V): this;

    /**
     * Returns a new Record which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: K): this;

    remove(key: K): this;

    /**
     * Returns a new Record containing no keys or values.
     */
    clear(): this;

    /**
     * Returns a new Record having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Record itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: this) => this): this;

    update(key: K, updater: (value: V) => V): this;

    update(key: K, notSetValue: V, updater: (value: V) => V): this;

    /**
     * Returns a new Record resulting from merging the provided Immutable.Iterables
     * (or JS objects) into this Record. In other words, this takes each entry of
     * each iterable and sets it on this Record.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.Iterable.isIterable`) then they are deeply converted
     * via `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Record({a: 10, b: 20, c: 30});
     *     var y = Immutable.Record({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<K, V>[]): this;

    merge(...iterables: { [ key: string ]: V }[]): Record<string, V>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Record resulting from merging
     * the provided Immutable.Iterables (or JS objects) into this Record, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Record({a: 10, b: 20, c: 30});
     *     var y = Immutable.Record({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: V, next?: V, key?: K) => V,
        ...iterables: Immutable.Iterable<K, V>[]
    ): this;

    mergeWith(
        merger: (previous?: V, next?: V, key?: K) => V,
        ...iterables: { [ key: string ]: V }[]
    ): Record<string, V>;

    /**
     * Like `merge()`, but when two Immutable.Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<K, V>[]): this;

    mergeDeep(...iterables: { [ key: string ]: V }[]): Record<string, V>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: V, next?: V, key?: K) => V,
        ...iterables: Immutable.Iterable<K, V>[]
    ): this;

    mergeDeepWith(
        merger: (previous?: V, next?: V, key?: K) => V,
        ...iterables: { [ key: string ]: V }[]
    ): Record<string, V>;


    // Deep persistent changes

    /**
     * Returns a new Record having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Record will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): this;

    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): this;

    /**
     * Returns a new Record having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): this;

    deleteIn(keyPath: Immutable.Iterable<any, any>): this;

    removeIn(keyPath: Array<any>): this;

    removeIn(keyPath: Immutable.Iterable<any, any>): this;

    /**
     * Returns a new Record having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Record`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any,
    ): this;

    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any,
    ): this;

    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any,
    ): this;

    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any,
    ): this;

    /**
     * A combination of `updateIn` and `merge`, returning a new Record, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<K, V>[]
    ): this;

    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<K, V>[]
    ): this;

    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [ key: string ]: V }[]
    ): Record<string, V>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Record, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<K, V>[]
    ): this;

    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<K, V>[]
    ): this;

    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [ key: string ]: V }[]
    ): Record<string, V>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Record is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Records.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Record, `withMutations()` creates a temporary mutable copy of the Record which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Records:
     *
     *     var map1 = Immutable.Record();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: this) => any): this;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): this;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): this;
}

export namespace Record {
    export interface Class<K, V> {
        new(): Record<K, V>;

        new(values: { [ key: string ]: any }): Record<K, V>;

        (): Record<K, V>;

        (values: { [ key: string ]: any }): Record<K, V>;
    }
}

export function Record<K, V>(defaultValues: { [ key: string ]: any }, name?: string): Record.Class<K, V> {
    return Immutable.Record(defaultValues, name) as any;
}



class R extends Record<string,string>({a: 'a', b: 'b'})  {
    asdf(){
        console.log('asdf', this)
    }
}

const c = (new R())
c.asdf();


const aa = c.toMap();

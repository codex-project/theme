import React from 'react';
import classNames from 'classnames';
import { strEnsureLeft } from 'utils/general';

type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

interface ClassDictionary {
    [ id: string ]: any;
}

interface ClassArray extends Array<ClassValue> {} // tslint:disable-line no-empty-interface

interface ClassNamer {
    (prefixed: ClassValue[], names?: ClassValue[]): string

    regular(...names: ClassValue[]): string

    prefix(...names: ClassValue[]): string

    root(...names: ClassValue[]): (...names: ClassValue[]) => string
}

export function getClassNamer<T extends any>(Component: React.ComponentType<T>, props: T, prefixCls?: string): ClassNamer
export function getClassNamer<T extends any>(instance: React.Component<T>, prefixCls?: string): ClassNamer
export function getClassNamer<T extends any>(...args: any[]): ClassNamer {
    let Component, props, prefixCls;

    if ( args[ 0 ].props ) {
        Component = args[ 0 ].constructor;
        props     = args[ 0 ].props;
        prefixCls = args[ 1 ];
    } else {
        Component = args[ 0 ];
        props     = args[ 1 ];
        prefixCls = args[ 2 ];
    }

    const { defaultProps = {} } = Component as React.ComponentClass<any>;
    let className               = props.className || null;

    if ( ! prefixCls ) {
        if ( props.prefixCls && props.prefixCls !== defaultProps.prefixCls ) {
            prefixCls = props.prefixCls;
        }

        if ( defaultProps.prefixCls ) {
            prefixCls = defaultProps.prefixCls;
        }
    }

    function prefix(name: string | number | boolean) {
        return name === false || name === null ? null : strEnsureLeft(name.toString(), prefixCls + (name.toString().length > 0 ? '-' : ''));
    }

    function prefixNames(names: ClassValue[]) {
        return names.map(value => {
            if ( typeof value === 'object' ) {
                let newVal = {};
                Object.keys(value).forEach(key => {
                    newVal[ prefix(key) ] = value[ key ];
                });
                return newVal;
            } else if ( Array.isArray(value) ) {
                return prefixNames(value);
            }
            return prefix(value);
        });
    }

    function getClassNames(...names: ClassValue[]) {
        return classNames(names);
    }

    function getPrefixedClassNames(...names: ClassValue[]) {
        return getClassNames(prefixNames(names));
    }

    function get(prefixed: ClassValue[] = [], names: ClassValue[] = []) {
        return getClassNames(getPrefixedClassNames(...prefixed), ...names);
    }

    get.regular = (...names: ClassValue[]) => getClassNames(...names);
    get.prefix  = (...prefixed: ClassValue[]) => getPrefixedClassNames(...prefixed);
    get.root    = (...prefixed: ClassValue[]) => (...names: ClassValue[]) => getClassNames(getPrefixedClassNames('', ...prefixed), className, ...names);

    return get as ClassNamer;
}



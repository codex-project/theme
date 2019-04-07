/**
 * Returns a createElement() type based on the props of the Component.
 * Useful for calculating what type a component should render as.
 *
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @param {function} [getDefault] A function that returns a default element type.
 * @returns {string|function} A ReactElement type
 */
import React from 'react';

function isInstance<P extends any, T extends React.Component<any>>(val): val is React.ClassType<P,T, any>{
    return val && val.render && val.props;
}

export function getElementType<T extends any>(Component: React.ComponentType<T>, props: T, getDefault?: () => React.ElementType<T>): React.ElementType<Partial<T>>
export function getElementType<P extends any, T extends React.Component<any>>(instance: React.ClassType<P,T, any>, getDefault?: () => React.ElementType<T>): React.ElementType<Partial<T>>
export function getElementType<T extends any>(...args: any[]): React.ElementType<Partial<T>> {
    let Component, props;

    if ( isInstance(args[ 0 ]) ) {
        props     = args[ 0 ].props;
        Component = args[ 0 ].constructor;
    } else {
        Component = args[ 0 ];
        props     = args[ 1 ];
    }

    const { defaultProps = {} as any } = Component;

    if ( props.as && props.as !== defaultProps.as ) {
        return props.as;
    }

    if ( typeof args[ args.length - 1 ] === 'function' ) {
        const getDefault      = args[ args.length - 1 ];
        const computedDefault = getDefault();
        if ( computedDefault ) return computedDefault as any;
    }

    if ( defaultProps.as ) {
        return defaultProps.as;
    }

    if ( props.href ) {
        return 'a' as any;
    }

    return 'div' as any;
}



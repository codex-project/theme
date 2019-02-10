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

export  function getElementType<T extends any>(Component: React.ComponentType<T>, props: T, getDefault?: () => React.ReactType): React.ReactType<T> {
    const { defaultProps = {} } = Component;

    if ( props.as && props.as !== defaultProps.as ) {
        return props.as;
    }

    if ( getDefault ) {
        const computedDefault = getDefault();
        if ( computedDefault ) return computedDefault as any;
    }

    if(defaultProps.as){
        return defaultProps.as
    }

    if ( props.href ) {
        return 'a' as any;
    }

    return 'div' as any;
}



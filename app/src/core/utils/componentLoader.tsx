import { Loading } from '../components/loading';
import Loadable from 'react-loadable';
import React from 'react';
import { RouteComponentProps } from 'react-router';

export const componentLoader: ComponentLoaderFn = (
    loader,
    render  = (loaded, props) => <loaded.default {...props} />,
    options = {},
) => {
    if ( typeof loader === 'function' ) {
        return Loadable({ loader, loading: Loading, render, ...options });
    } else if ( typeof loader === 'object' ) {
        return Loadable.Map({ loader, loading: Loading, render, ...options });
    }
    throw Error('Invalid loader argument');
};


export type ComponentLoaderLoader<T> = () => Promise<T>
export type ComponentLoaderMapLoader<LOADER extends Record<string, any>> = {
    [P in keyof LOADER]: () => Promise<LOADER[P]>
}
export type ComponentLoaderRender<T, PARAMS extends any = any> = (loaded: T, props: RouteComponentProps<PARAMS>) => React.ReactNode;
export type ComponentLoaderOptions = Partial<Loadable.CommonOptions>
export type ComponentLoader<T, PARAMS extends any = any> = {
    loader?: ComponentLoaderLoader<T>,
    render?: ComponentLoaderRender<T,PARAMS>,
    options?: ComponentLoaderOptions,
}
export type ComponentMapLoader<T, PARAMS extends any = any> = {
    loader?: ComponentLoaderMapLoader<T>,
    render?: ComponentLoaderRender<T,PARAMS>,
    options?: ComponentLoaderOptions,
}

export type ComponentLoaderFn<PARAMS extends any = any> = {
    <T>(
        loader: ComponentLoaderLoader<T>,
        render?: ComponentLoaderRender<T, PARAMS>,
        options?: ComponentLoaderOptions,
    ): any
    <T extends Record<string, any>>(
        loader: ComponentLoaderMapLoader<T>,
        render: ComponentLoaderRender<T, PARAMS>,
        options?: ComponentLoaderOptions,
    ): any
}

import { Loading } from '../components/loading';
import Loadable from 'react-loadable';
import * as React from 'react';

export const componentLoader = (
    loader: (() => Promise<any>) | Record<string, () => Promise<any>>,
    render: (loaded: any, props: any) => React.ReactNode = (loaded, props) => <loaded.default {...props} />,
    options: Partial<Loadable.CommonOptions>             = {},
) => {
    if ( typeof loader === 'function' ) {
        return Loadable({ loader, loading: Loading, render, ...options });
    } else if ( typeof loader === 'object' ) {
        return Loadable.Map({ loader, loading: Loading, render, ...options });
    }
    throw Error('Invalid loader argument');
};

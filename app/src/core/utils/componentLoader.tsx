import { Loading } from '../components/loading';
import Loadable from 'react-loadable';
import * as React from 'react';

export const componentLoader = (loader: () => any, render: (loaded: any, props: any) => React.ReactNode=(loaded, props) => <loaded.default {...props} />) => Loadable({ loader, loading: Loading, render })
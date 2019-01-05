import { Loading } from 'components/loading';
import Loadable from 'react-loadable';
import * as React from 'react';
export const componentLoader = (loader, render = (loaded, props) => <loaded.default {...props}/>) => Loadable({ loader, loading: Loading, render });

import React from 'react';
import { LayoutStore, lazyInject } from '@codex/core';
import { observer } from 'mobx-react';
import { WelcomePage } from '../components/WelcomePage';
import { hot } from 'react-hot-loader';


const log = require('debug')('views:home');

export interface WelcomeViewProps {}

@hot(module)
@observer
export class WelcomeView extends React.Component<WelcomeViewProps, {}> {
    @lazyInject('store.layout') protected layout: LayoutStore;
    static displayName = 'WelcomeView';

    render() {
        return <WelcomePage/>;
    }
}


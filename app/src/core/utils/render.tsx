import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Provider } from 'mobx-react';
import { app } from '../ioc';


export const render = (elid, Component, cb?: () => void) => {
    const inner = (
        <BrowserRouter>
            <Provider store={app.get('store')}>
                <Component/>
            </Provider>
        </BrowserRouter>
    );
    if ( DEV ) {
        const AppContainer = require('react-hot-loader').AppContainer;
        ReactDOM.render(<AppContainer>{inner}</AppContainer>, document.getElementById(elid), cb);
    } else {
        ReactDOM.render(inner, document.getElementById(elid), cb);
    }
};


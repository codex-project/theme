import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';


export const render = (elid, Component, cb?: () => void) => {
    const inner = (
        <BrowserRouter>
            <Component/>
        </BrowserRouter>
    );
    if ( DEV ) {
        const AppContainer = require('react-hot-loader').AppContainer;
        ReactDOM.render(<AppContainer>{inner}</AppContainer>, document.getElementById(elid), cb);
    } else {
        ReactDOM.render(inner, document.getElementById(elid), cb);
    }
};


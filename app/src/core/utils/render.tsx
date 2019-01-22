import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { RouterProvider } from 'react-router5';
import { app } from 'ioc';


export const render = (elid, Component, cb?: () => void) => {


    const inner2 = (
        <BrowserRouter>
            <Component/>
        </BrowserRouter>
    );
    const inner = (
        <RouterProvider router={app.get('router')}>
            <Component/>
        </RouterProvider>
    )
    if ( DEV ) {
        ReactDOM.render(inner, document.getElementById(elid), cb);
        // const AppContainer = require('react-hot-loader').AppContainer;
        // ReactDOM.render(<AppContainer>{inner}</AppContainer>, document.getElementById(elid), cb);
    } else {
        ReactDOM.render(inner, document.getElementById(elid), cb);
    }
};


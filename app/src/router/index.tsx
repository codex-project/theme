///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>
import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import './ioc';
import { Router } from './Router';
import App from './App';

window.document.addEventListener('DOMContentLoaded', function (event) {
    console.log('DOM fully loaded and parsed');

    ReactDOM.render(<App/>, document.getElementById('root'));

    // r.navigate('first', { id: 3 });
    // r.wait(5000, () => {
    //     let h = r[ 'history' ];
    //     let a = { r, h };
    // });


});


export { Router };

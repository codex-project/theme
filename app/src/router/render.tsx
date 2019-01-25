import ReactDOM from 'react-dom';
import App from './App';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export function render() {
    ReactDOM.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
        document.getElementById('root')
    )
}

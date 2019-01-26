import ReactDOM from 'react-dom';
import App from './App';
import React from 'react';
import CodexRouter from './router/CodexRouter';

export function render() {
    ReactDOM.render(
        <CodexRouter>
            <App/>
        </CodexRouter>,
        document.getElementById('root'),
    );
}

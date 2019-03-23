import React, { Component } from 'react';
import { f, h } from 'classes/Hyper';


const log = require('debug')('components:Hyperstring');
export interface HyperstringProps {
    string?: string
    children?: string
}

export class Hyperstring extends Component<HyperstringProps> {
    static displayName                             = 'Hyperstring';
    static defaultProps: Partial<HyperstringProps> = {};

    render() {
        let { children, ...props } = this.props;
        let code                   = this.props.string;
        if ( ! code && Array.isArray(children) ) {
            code = children.map(child => child.toString().trim()).join(';').replace(/\;\;/g, ';');
        }
        code = decodeURI(code.toString().trim())
        // code = code.toString().trim();

        log('render', {code, children});

        return this.eval(code) || null;
    }

    eval(code: string) {
        return (function (code, h, f, global, window, root, document) {
            try {
                return eval(code);
            } catch ( e ) {
                console.warn('Could not eval Hyperstring', code);
                console.warn(e);
                return null;
            }
        })(code.toString(), h, f, null, null, null, null);
    }
}

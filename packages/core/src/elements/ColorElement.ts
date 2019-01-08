import { getColor, colorKeys } from '../utils/colors';

// const colorKeys = Object.keys(_colors);
const log       = require('debug')('elements:ColorElement');

export class ColorElement extends HTMLElement {
    static TAG = 'c-c';

    // static observedAttributes: string[] = []

    constructor() {
        super();
        // log('constructor', this, Array.from(this.attributes))
    }

    connectedCallback() {
        // log('connectedCallback', this)
        Array.from(this.attributes).forEach(attr => {
            // log('attr', attr.name, attr.value, attr.value === '', colorKeys.includes(attr.name))
            if ( attr.value === '' && colorKeys.includes(attr.name) ) {
                // this.setAttribute('style', `color: ${_colors[ attr.name ]}`)
                this.style.color = getColor(attr.name);
                this.removeAttribute(attr.name);
            }
        })
    }

    disconnectedCallback() {
        log('disconnectedCallback', this)
    }

    attributeChangedCallback() {
        log('attributeChangedCallback', this)
    }

}

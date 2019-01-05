var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { htmlparser2, processNodes } from 'react-html-parser';
import { getRandomId } from '../utils/general';
import { injectable } from 'inversify';
const log = require('debug')('core:HtmlComponents');
export function htmlParser(html, options = {}) {
    options = Object.assign({ decodeEntities: true, lowerCaseTags: false, preprocessNodes: nodes => nodes }, options);
    const nodes = options.preprocessNodes(htmlparser2.parseDOM(html, { decodeEntities: options.decodeEntities, lowerCaseTags: options.lowerCaseTags }));
    return processNodes(nodes, options.transform);
}
let HtmlComponents = class HtmlComponents {
    constructor() {
        this.components = {};
        this.transformFn = (node) => {
            if (this.has(node.name)) {
                let rnd = getRandomId(5);
                let Component = this.get(node.name);
                let props = {};
                if (node.attribs.props) {
                    props = JSON.parse(node.attribs.props.replace(/\\/g, '\\\\'));
                    delete node.attribs.props;
                }
                props = Object.assign({ key: node.name + rnd }, node.attribs, props);
                node.children = node.children.map((child, index) => {
                    child.attribs = child.attribs || {};
                    child.attribs.key = child.attribs.key || index + rnd;
                    return child;
                });
                if (props.class) {
                    props.className = props.class;
                    delete props.class;
                }
                log('hasTransform', node.name, { props, node, Component });
                return <Component {...props}>{processNodes(node.children, this.transformFn)}</Component>;
            }
        };
    }
    registerMap(map) {
        let keys = Object.keys(map);
        keys.forEach(key => {
            this.register(key, map[key]);
        });
    }
    register(tag, Component) { this.components[tag] = Component; }
    has(tag) { return this.components[tag] !== undefined; }
    get(tag) { return this.components[tag]; }
    parse(html) { return htmlParser(html, { transform: this.transformFn }); }
};
HtmlComponents = __decorate([
    injectable()
], HtmlComponents);
export { HtmlComponents };

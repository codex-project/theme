import React from 'react';
import { htmlparser2, Node, Options, processNodes } from 'react-html-parser';
import { getRandomId } from '../utils/general';
import { injectable } from 'inversify';
import { lazyInject } from 'ioc';
import { ComponentRegistry } from 'classes/ComponentRegistry';

const log = require('debug')('core:HtmlComponents');

export interface ExtendedOptions extends Options {
    lowerCaseTags?: boolean
    decodeEntities?: any
    preprocessNodes?: any
    transform?: any
}

export function htmlParser(html: string, options: ExtendedOptions = {}) {
    options     = {
        decodeEntities : true,
        lowerCaseTags  : false,
        preprocessNodes: nodes => nodes,
        ...options,
    };
    const nodes = options.preprocessNodes(htmlparser2.parseDOM(html, { decodeEntities: options.decodeEntities, lowerCaseTags: options.lowerCaseTags }));
    return processNodes(nodes, options.transform);
}

@injectable()
export class HtmlParser {
    @lazyInject('components') public readonly components: ComponentRegistry;

    protected transformFn = (node: Node) => {
        if ( this.components.has(node.name) ) {
            let rnd        = getRandomId(5);
            let item       = this.components.get(node.name);
            let Component  = item.Component;
            let props: any = {};
            if ( node.attribs.props ) {
                try {
                    props = JSON.parse(node.attribs.props.replace(/\\/g, '\\\\'));
                } catch ( e ) {
                    console.warn(e);
                }
                delete node.attribs.props;
            }
            props         = {
                key: node.name + rnd,
                ...node.attribs,
                ...props,
            };
            node.children = node.children.map((child, index) => {
                child.attribs     = child.attribs || {};
                child.attribs.key = child.attribs.key || index + rnd;
                return child;
            });
            if ( props.class ) {
                props.className = props.class;
                delete props.class;
            }
            // log('hasTransform', node.name, { props, node, Component })

            return <Component {...props}>{processNodes(node.children, this.transformFn)}</Component>;
        }
    };

    parse(html: string) { return htmlParser(html, { transform: this.transformFn }); }

}

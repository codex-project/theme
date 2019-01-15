import React from 'react';
import { htmlparser2, Node, Options, processNodes } from 'react-html-parser';
import { getRandomId } from '../utils/general';
import { injectable } from 'inversify';

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
        ...options
    }
    const nodes = options.preprocessNodes(htmlparser2.parseDOM(html, { decodeEntities: options.decodeEntities, lowerCaseTags: options.lowerCaseTags }));
    return processNodes(nodes, options.transform);
}

@injectable()
export class HtmlComponents {
    protected components: Record<string, React.ComponentType> = {}

    protected transformFn = (node: Node) => {
        if ( this.has(node.name) ) {
            let rnd        = getRandomId(5);
            let Component  = this.get(node.name);
            let props: any = {}
            if ( node.attribs.props ) {
                props = JSON.parse(node.attribs.props.replace(/\\/g, '\\\\'))
                delete node.attribs.props;
            }
            props         = {
                key: node.name + rnd,
                ...node.attribs,
                ...props
            }
            node.children = node.children.map((child, index) => {
                child.attribs     = child.attribs || {}
                child.attribs.key = child.attribs.key || index + rnd
                return child;
            })
            if ( props.class ) {
                props.className = props.class;
                delete props.class;
            }
            // log('hasTransform', node.name, { props, node, Component })

            return <Component {...props}>{processNodes(node.children, this.transformFn)}</Component>
        }
    }

    registerMap(map: Record<string, React.ComponentType>) {
        let keys = Object.keys(map)
        keys.forEach(key => {
            this.register(key, map[ key ]);
        })
    }

    register(tag: string, Component: React.ComponentType) { this.components[ tag ] = Component; }

    has(tag: string): boolean { return this.components[ tag ] !== undefined }

    get(tag: string): React.ComponentType { return this.components[ tag ]; }

    parse(html: string) { return htmlParser(html, { transform: this.transformFn }); }

}

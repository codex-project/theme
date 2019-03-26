import React, { ComponentType, ReactElement } from 'react';
import { ComponentElements, ComponentID, Components } from 'codex-components';
// import { PhpdocComponents } from '../../phpdoc';
// noinspection ES6UnusedImports
import { app } from 'ioc';
import { ComponentRegistry } from 'classes/ComponentRegistry';
import _h from 'react-hyperscript';

type Element = ReactElement | string | number | null;

const log = require('debug')('classes:Hyper');

export class Hyper {
    static get components(): ComponentRegistry { return app.get<ComponentRegistry>('components');}

    static render: Hyper.RenderFn = (...args: any[]) => {
        let len   = args.length;
        let types = args.map(arg => typeof arg);

        // fragment
        if ( len === 1 && (Array.isArray(args[ 0 ]) || React.isValidElement(args[ 0 ])) ) {
            return _h(React.Fragment, {}, args[ 0 ]);
        }

        let type     = args[ 0 ],
            props    = {},
            children = null;

        if ( len === 2 && (Array.isArray(args[ 1 ]) || React.isValidElement(args[ 1 ]) || types[ 1 ] === 'string') ) {
            children = args[ 1 ];
        } else if ( len === 2 && types[ 1 ] === 'object' ) {
            props = args[ 1 ];
        } else if ( len > 2 && (Array.isArray(args[ 2 ]) || React.isValidElement(args[ 2 ]) || types[ 2 ] === 'string') ) {
            props    = args[ 1 ];
            children = args[ 2 ];
        }

        if ( types[ 0 ] === 'string' && Hyper.components.has(args[ 0 ]) ) {
            if ( Hyper.components.has(args[ 0 ]) ) {
                let component = Hyper.components.get(args[ 0 ]);
                type          = component.Component;
                props         = { ...component.options.defaultProps, ...props };
            }
        }

        let result = _h(type, props, children);
        log('render', { type, props, children }, { result });
        return result;
    };

    static fragment: Hyper.FragmentFn = (...children: ReactElement<any>[]) => {
        // React.Children.map(children, (child,i) => React.cloneElement(child,))
        return React.createElement(React.Fragment, {}, ...children);
    };
}

export namespace Hyper {
    export interface RenderFn {

        <P>(children: Array<ReactElement<any>>): ReactElement<P>


        <P>(tag: keyof JSX.IntrinsicElements, children?: Array<Element> | Element): ReactElement<P>

        <E extends JSX.IntrinsicElements, T extends keyof E>(tag: T, props: E[T], children?: Array<Element> | Element): ReactElement<E[T]>

        <P>(component: ComponentType<P>, children?: Array<Element> | Element): ReactElement<P>

        <P>(component: ComponentType<P>, props?: Partial<P>, children?: Array<Element> | Element): ReactElement<P>


        <C extends Components, ID extends ComponentID>(id: ID, children?: Array<Element> | Element): ComponentElements[ID]

        <C extends Components, ID extends keyof C>(id: ID, props?: C[ID], children?: Array<Element> | Element): ReactElement<C[ID]>
    }

    export interface FragmentFn {
        (...children: ReactElement<any>[]): ReactElement<any>
    }


}

export const h: Hyper.RenderFn   = (...args: any[]) => Hyper.render(...args as [any,any,any]);
export const f: Hyper.FragmentFn = (...args: any[]) => Hyper.fragment(...args);



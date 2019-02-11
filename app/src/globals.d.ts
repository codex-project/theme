/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="hammerjs" />






declare module '*.styl';
declare module '*.scss';
declare module '*.mscss';
declare module '*.less';
declare module '*.json';


declare const DEV: boolean
declare const ENV: any
declare const PROD: boolean
declare const TEST: boolean
declare const APP_VERSION: string
// declare module 'react' {
//     interface HTMLAttributes<T> {
//         styleName?: string;
//     }
//     interface SVGAttributes<T> {
//         styleName?: string;
//     }
// }


declare function For<T>({ each, of, index }: { each: string; of: T[]; index?: string });

declare interface IfProps {
    condition?:any


    // empty?:any
    // notEmpty?:any

    // boolean
    true?:any // if props.true === true
    false?:any

    // typeofs
    number?:any // typeof props.number === 'number'
    string?:any
    array?:any
    undefined?:any
    boolean?:any
    function?:any

    // comparisons
    value?:any
    gt?:any // if props.value > props.gt
    lt?:any
    eq?:any
}
declare function If(props:IfProps);

declare function Choose(__ignore:any);

declare function When({ condition }: { condition: boolean });

declare function Otherwise(__ignore:any):any;

declare function With(props: { [ id: string ]: any });

declare module "*.css" {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module 'react-hammerjs' {
    type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

    export type HammerOptionsWithRecognizers = Omit<HammerOptions, "recognizers"> & {
        recognizers?: { [gesture: string]: RecognizerOptions };
    };

    export interface HammerDirectionValues {
        DIRECTION_NONE: number;
        DIRECTION_LEFT: number;
        DIRECTION_RIGHT: number;
        DIRECTION_UP: number;
        DIRECTION_DOWN: number;
        DIRECTION_HORIZONTAL: number;
        DIRECTION_VERTICAL: number;
        DIRECTION_ALL: number;
    }

    export type HammerDirection = keyof HammerDirectionValues

    export interface HammerComponentProps {
        style?: React.CSSProperties
        className?: string
        direction?: HammerDirection
        recognizeWith?: { [gesture: string]: Recognizer | string };
        vertical?: boolean;
        options?: HammerOptionsWithRecognizers


        action?: HammerListener;
        onDoubleTap?: HammerListener;
        onPan?: HammerListener;
        onPanCancel?: HammerListener;
        onPanEnd?: HammerListener;
        onPanStart?: HammerListener;
        onPinch?: HammerListener;
        onPinchCancel?: HammerListener;
        onPinchEnd?: HammerListener;
        onPinchIn?: HammerListener;
        onPinchStart?: HammerListener;
        onPress?: HammerListener;
        onPressUp?: HammerListener;
        onRotate?: HammerListener;
        onRotateCancel?: HammerListener;
        onRotateEnd?: HammerListener;
        onRotateMove?: HammerListener;
        onRotateStart?: HammerListener;
        onSwipe?: HammerListener;
        onTap?: HammerListener;
    }

    export default class HammerComponent extends React.Component<HammerComponentProps> {

    }
}


declare module 'react-html-parser' {
    import React from 'react'

    export const htmlparser2: any

    export interface Node<A = any> {
        type: 'tag' | 'text' | 'style'
        name: string
        children: Node[]
        attribs: A
        next: Node
        prev: Node
        parent: Node
        data: string
    }

    export interface Options {
        decodeEntities?: boolean
        transform?: (node: Node, index: number) => null | undefined | React.ReactElement<any>
        preprocessNodes?: <T>(nodes: T) => T
    }

    export default function (html: string, options: Options): React.ReactElement<any>[]

    export function processNodes(nodes: any[], transform: Function): React.ReactElement<any>[]

    export function convertNodeToElement(node: any, index: number, transform: Function): React.ReactElement<any>
}


declare class ResizeObserver {
    constructor(cb: ResizeObserverCallback)

    observe(target: Element): void;

    unobserve(target: Element): void;

    disconnect(): void;
}
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test'
        PUBLIC_URL: string
    }
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module '*.module.css' {
    const classes: { [ key: string ]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [ key: string ]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { [ key: string ]: string };
    export default classes;
}

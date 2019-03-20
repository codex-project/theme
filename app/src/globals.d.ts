/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="hammerjs" />


declare module '*.styl';
declare module '*.scss';
declare module '*.mscss';
declare module '*.less';
declare module '*.json';


declare const DEV: boolean;
declare const ENV: any;
declare const PROD: boolean;
declare const TEST: boolean;
declare const APP_VERSION: string;
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
    condition?: any


    // empty?:any
    // notEmpty?:any

    // boolean
    true?: any // if props.true === true
    false?: any

    // typeofs
    number?: any // typeof props.number === 'number'
    string?: any
    array?: any
    undefined?: any
    boolean?: any
    function?: any

    // comparisons
    value?: any
    gt?: any // if props.value > props.gt
    lt?: any
    eq?: any
}

declare function If(props: IfProps);

declare function Choose(__ignore: any);

declare function When({ condition }: { condition: boolean });

declare function Otherwise(__ignore: any): any;

declare function With(props: { [ id: string ]: any });

declare module '*.css' {
    interface IClassNames {
        [ className: string ]: string;
    }

    const classNames: IClassNames;
    export = classNames;
}

declare module 'react-hammerjs' {
    type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

    export type HammerOptionsWithRecognizers = Omit<HammerOptions, 'recognizers'> & {
        recognizers?: { [ gesture: string ]: RecognizerOptions };
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
        recognizeWith?: { [ gesture: string ]: Recognizer | string };
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


declare module 'react-dazzle' {
    import React from 'react';

        export interface DashboardProps {

            /**
             * The layout of the dashboard.
             */
            layout?: object,

            /**
             * List of widgets that are avilable in the dashboard.
             */
            widgets?: object,

            /**
             * Indicates weather the dashoard is in editable state or not.
             */
            editable?: bool,

            /**
             * CSS class name that should be provided to the row. Default is 'row'.
             */
            rowClass?: string,

            /**
             * Customized widget frame. The dashboard supports a default frame. But if
             * it doesn't suit your needs or the look and feel is not what you wanted, you
             * could create your own widget frame and pass it through here. Ever widget Will
             * use this as the outer container which displays controls like 'remove' button
             * on edit mode.
             */
            frameComponent?: Function,

            /**
             * A custom component for the `add widget` button.
             */
            addWidgetComponent?: Function,

            /**
             * Class to be used for columns in editable mode.
             */
            editableColumnClass?: string,

            /**
             * CSS class to be used for columns when a widget is droppable.
             */
            droppableColumnClass?: string,

            /**
             * Text that should be displayed in the `AddWidget` component.
             */
            addWidgetComponentText?: string,

            /**
             * Will be called when a widget removed by the user from the dashboard.
             * Should be handled if the dashbord supports edit functionality.
             * provides the updated layout object. This layout object  with the removed widget
             * should be given back to the dashboard through the layout prop to re-render the dashboard.
             */
            onRemove?: Function,

            /**
             * Will be called when user tries to add a widget into a column.
             */
            onAdd?: Function,

            /**
             * Function to be called when a widget is moved by the user.
             */
            onMove?: Function,
            /**
             * Function to be called when a widget is edited.
             */
            onEdit?: Function,
        }

        // class DashboardWithoutDndContext extends Dashboard {}


    export default class Dashboard extends React.Component<DashboardProps> {}
    export class DashboardWithoutDndContext extends React.Component<DashboardProps> {}


}


declare module 'react-html-parser' {
    import React from 'react';

    export const htmlparser2: any;

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


declare module 'react-iframe-resizer-super' {
    import { IFrameOptions } from 'iframe-resizer';

    export interface ReactIframeResizerProps {
        content?: string | HTMLElement
        src?: string
        iframeResizerEnable?: boolean
        iframeResizerOptions?: IFrameOptions
        iframeResizerUrl?: string | boolean
        id?: string
        frameBorder?: number
        className?: string
        style?: React.CSSProperties
    }

    export default class ReactIframeResizer extends React.Component<ReactIframeResizerProps> {}
}

declare module 'react-emoji-render' {
    interface Options {
        protocol?: 'http' | 'https';
        baseUrl?: string;
        /** On the format WxH, like `72x72`. */
        size?: string;
        ext?: 'svg' | 'png';
        className?: string;
    }

    export interface Props {
        /** Text to render to emoji. Can include unicode emojis, as well as :shortcode:
         * variants.
         */
        text?: string;
        props?: any;
        className?: string;
        /** The className passed as the onlyEmojiClassName prop is added when the provided text contains only three or less emoji characters. This allows you to add custom styles in this scenario. */
        onlyEmojiClassName?: string;
        /** Use SVG for Twemoji and Emojion. Defaults to false (using .png instead). */
        svg?: boolean;
        options?: Options;
    }

    type ReturnType = JSX.Element;

    /**
     * By default the component will normalize all of the different emoji
     * notations to native unicode characters.
     */
    export function Emoji(opts: Props): ReturnType;

    /**
     * Twemoji is an emoji set designed by Twitter, you can use the included Twemoji
     * component to render emoji images in this style.
     *
     * @see https://github.com/twitter/twemoji
     */
    export function Twemoji(opts: Props): ReturnType;

    /**
     * Emojione is a great looking open source emoji set, you can use
     * the included Emojione component to render emoji images in this style.
     *
     * @see https://github.com/Ranks/emojione
     */
    export function Emojione(opts: Props): ReturnType;

    export default Emoji;

    /**
     * If you want to do further processing on the output, for example
     * parsing HTML then it may be useful to not have the normalized
     * emojis be wrapped in a component.
     */
    export function toArray(
        text: string,
        options?: Options,
    ): React.ReactNodeArray;
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

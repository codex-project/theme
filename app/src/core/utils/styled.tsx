import { classes, style, types } from 'typestyle';
import React from 'react';
import { getElementType } from 'utils/getElementType';
import { tuple } from './tuple';

export type CSS = types.NestedCSSProperties;

export interface FactoryProps<Ref> {
    as?: React.ElementType
    innerRef?: React.RefObject<Ref>
}

export type FactoryStyles<PROPS extends FactoryProps<any>> = CSS | ((props: PROPS) => CSS)
export type StyledComponentProps<HTMLELEMENT, PROPS = {}> = {} & PROPS & React.HTMLProps<HTMLELEMENT>
export type CreatedFactoryFn<HTMLELEMENT> = <PROPS extends FactoryProps<HTMLELEMENT>>(...styles: FactoryStyles<PROPS>[]) => React.ComponentClass<StyledComponentProps<HTMLELEMENT, PROPS>>

export type HTMLElements = {
    a: CreatedFactoryFn<HTMLAnchorElement>
    abbr: CreatedFactoryFn<HTMLElement>
    address: CreatedFactoryFn<HTMLElement>
    area: CreatedFactoryFn<HTMLAreaElement>
    article: CreatedFactoryFn<HTMLElement>
    aside: CreatedFactoryFn<HTMLElement>
    audio: CreatedFactoryFn<HTMLAudioElement>
    b: CreatedFactoryFn<HTMLElement>
    base: CreatedFactoryFn<HTMLBaseElement>
    bdi: CreatedFactoryFn<HTMLElement>
    bdo: CreatedFactoryFn<HTMLElement>
    big: CreatedFactoryFn<HTMLElement>
    blockquote: CreatedFactoryFn<HTMLElement>
    body: CreatedFactoryFn<HTMLBodyElement>
    br: CreatedFactoryFn<HTMLBRElement>
    button: CreatedFactoryFn<HTMLButtonElement>
    canvas: CreatedFactoryFn<HTMLCanvasElement>
    caption: CreatedFactoryFn<HTMLElement>
    cite: CreatedFactoryFn<HTMLElement>
    code: CreatedFactoryFn<HTMLElement>
    col: CreatedFactoryFn<HTMLTableColElement>
    colgroup: CreatedFactoryFn<HTMLTableColElement>
    data: CreatedFactoryFn<HTMLElement>
    datalist: CreatedFactoryFn<HTMLDataListElement>
    dd: CreatedFactoryFn<HTMLElement>
    del: CreatedFactoryFn<HTMLElement>
    details: CreatedFactoryFn<HTMLElement>
    dfn: CreatedFactoryFn<HTMLElement>
    dialog: CreatedFactoryFn<HTMLElement>
    div: CreatedFactoryFn<HTMLDivElement>
    dl: CreatedFactoryFn<HTMLDListElement>
    dt: CreatedFactoryFn<HTMLElement>
    em: CreatedFactoryFn<HTMLElement>
    embed: CreatedFactoryFn<HTMLEmbedElement>
    fieldset: CreatedFactoryFn<HTMLFieldSetElement>
    figcaption: CreatedFactoryFn<HTMLElement>
    figure: CreatedFactoryFn<HTMLElement>
    footer: CreatedFactoryFn<HTMLElement>
    form: CreatedFactoryFn<HTMLFormElement>
    h1: CreatedFactoryFn<HTMLHeadingElement>
    h2: CreatedFactoryFn<HTMLHeadingElement>
    h3: CreatedFactoryFn<HTMLHeadingElement>
    h4: CreatedFactoryFn<HTMLHeadingElement>
    h5: CreatedFactoryFn<HTMLHeadingElement>
    h6: CreatedFactoryFn<HTMLHeadingElement>
    head: CreatedFactoryFn<HTMLHeadElement>
    header: CreatedFactoryFn<HTMLElement>
    hgroup: CreatedFactoryFn<HTMLElement>
    hr: CreatedFactoryFn<HTMLHRElement>
    html: CreatedFactoryFn<HTMLHtmlElement>
    i: CreatedFactoryFn<HTMLElement>
    iframe: CreatedFactoryFn<HTMLIFrameElement>
    img: CreatedFactoryFn<HTMLImageElement>
    input: CreatedFactoryFn<HTMLInputElement>
    ins: CreatedFactoryFn<HTMLModElement>
    kbd: CreatedFactoryFn<HTMLElement>
    keygen: CreatedFactoryFn<HTMLElement>
    label: CreatedFactoryFn<HTMLLabelElement>
    legend: CreatedFactoryFn<HTMLLegendElement>
    li: CreatedFactoryFn<HTMLLIElement>
    link: CreatedFactoryFn<HTMLLinkElement>
    main: CreatedFactoryFn<HTMLElement>
    map: CreatedFactoryFn<HTMLMapElement>
    mark: CreatedFactoryFn<HTMLElement>
    menu: CreatedFactoryFn<HTMLElement>
    menuitem: CreatedFactoryFn<HTMLElement>
    meta: CreatedFactoryFn<HTMLMetaElement>
    meter: CreatedFactoryFn<HTMLElement>
    nav: CreatedFactoryFn<HTMLElement>
    noscript: CreatedFactoryFn<HTMLElement>
    object: CreatedFactoryFn<HTMLObjectElement>
    ol: CreatedFactoryFn<HTMLOListElement>
    optgroup: CreatedFactoryFn<HTMLOptGroupElement>
    option: CreatedFactoryFn<HTMLOptionElement>
    output: CreatedFactoryFn<HTMLElement>
    p: CreatedFactoryFn<HTMLParagraphElement>
    param: CreatedFactoryFn<HTMLParamElement>
    picture: CreatedFactoryFn<HTMLElement>
    pre: CreatedFactoryFn<HTMLPreElement>
    progress: CreatedFactoryFn<HTMLProgressElement>
    q: CreatedFactoryFn<HTMLQuoteElement>
    rp: CreatedFactoryFn<HTMLElement>
    rt: CreatedFactoryFn<HTMLElement>
    ruby: CreatedFactoryFn<HTMLElement>
    s: CreatedFactoryFn<HTMLElement>
    samp: CreatedFactoryFn<HTMLElement>
    script: CreatedFactoryFn<HTMLElement>
    section: CreatedFactoryFn<HTMLElement>
    select: CreatedFactoryFn<HTMLSelectElement>
    small: CreatedFactoryFn<HTMLElement>
    source: CreatedFactoryFn<HTMLSourceElement>
    span: CreatedFactoryFn<HTMLSpanElement>
    strong: CreatedFactoryFn<HTMLElement>
    sub: CreatedFactoryFn<HTMLElement>
    summary: CreatedFactoryFn<HTMLElement>
    sup: CreatedFactoryFn<HTMLElement>
    table: CreatedFactoryFn<HTMLTableElement>
    tbody: CreatedFactoryFn<HTMLTableSectionElement>
    td: CreatedFactoryFn<HTMLTableDataCellElement>
    textarea: CreatedFactoryFn<HTMLTextAreaElement>
    tfoot: CreatedFactoryFn<HTMLTableSectionElement>
    th: CreatedFactoryFn<HTMLTableHeaderCellElement>
    thead: CreatedFactoryFn<HTMLTableSectionElement>
    time: CreatedFactoryFn<HTMLElement>
    title: CreatedFactoryFn<HTMLTitleElement>
    tr: CreatedFactoryFn<HTMLTableRowElement>
    track: CreatedFactoryFn<HTMLTrackElement>
    u: CreatedFactoryFn<HTMLElement>
    ul: CreatedFactoryFn<HTMLUListElement>
    video: CreatedFactoryFn<HTMLVideoElement>
    wbr: CreatedFactoryFn<HTMLElement>
}
// export type Element = keyof Elements
export type Styled = HTMLElements & {
    <T>(Component: T): CreatedFactoryFn<T>
}
export const htmlElements = tuple('a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'video', 'wbr') as string[]
// export type HTMLElement = typeof h
type HTMLElement = (typeof htmlElements)[number];


const filterObject = <T extends {}>(obj: T, fn: (pair: [ string, {} ]) => boolean): T => (
    Object.entries(obj)
        .filter((pair) => fn(pair))
        .reduce((accObj, [ key, value ]) => {
            accObj[ key ] = value;
            return accObj;
        }, {} as any)
);


export function factory<HTMLELEMENT extends HTMLElement = HTMLElement>(Component: React.ElementType): CreatedFactoryFn<HTMLELEMENT> {

    return function <PROPS = {}>(...styles: FactoryStyles<PROPS>[]): React.ComponentClass<StyledComponentProps<HTMLELEMENT, PROPS>> {

        class StyledComponent extends React.Component<StyledComponentProps<HTMLELEMENT, PROPS>> {
            static defaultProps = {
                as: Component,
            };

            render() {
                const { children, className, innerRef = React.createRef(), as, ...rest } = this.props as any;
                const cssObjects                                                         = styles.map(obj => {
                    if ( typeof obj === 'function' ) {
                        return (obj as any)({ ...rest }); //, theme: this.context.theme })
                    }
                    return obj;
                }).reduce((acc, cur) => acc.concat(cur), []);

                const computedClassName = style(...cssObjects);
                const ElementType       = getElementType(StyledComponent as any, this.props);

                return React.createElement(ElementType, { ...rest, ref: innerRef, className: classes(computedClassName, className) }, children);
            }
        }

        return StyledComponent as any;
    };
}


export let styled: Styled;
styled = ((Component: React.ElementType) => {
    return factory(Component);
}) as any;

htmlElements.forEach(element => {
    styled[ element ] = factory(element);
});

export default styled;

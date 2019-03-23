import _h from 'react-hyperscript';

import React, { ComponentType, ReactElement } from 'react';

type Element = ReactElement | string | number | null;

export function h<P>(
    componentOrTag: ComponentType<P> | string,
    children?: ReadonlyArray<Element> | Element,
): ReactElement<P>
export function h<P>(
    componentOrTag: ComponentType<P> | string,
    properties: P,
    children?: ReadonlyArray<Element> | Element,
): ReactElement<P>
export function h(
    ...args: [ any, any, any?]
): any {
    return _h(...args);
}

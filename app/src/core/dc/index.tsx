/*

{
    type: 'div',
    props: {},
    children: [
        {
            type: 'LayoutHeader',
            props: {}
        }
    ]

}


c.add('div', c => {
    c.add('Layout', c => {
        c.add('LayoutSide', {})
        c.add('Layout', c => {
            c.add('LayoutHeader', {})
            c.add('Layout', c => {
                c.add('Content', c => {
                    c.add('Toolbar', c => {

                    })
                    c.add('Layout', c => {
                        c.add('Content', c => {
                            c.add('Routes', {})
                        })
                    })
                })
            })
            c.add('LayoutFooter', {})
        })
        c.add('LayoutSide', c => {})
        c.add('BackToTop', c => {})
    })


})


 */

//@formatter:off
import _h from 'react-hyperscript';

import React, {Component, ComponentType, ReactElement} from 'react';
// noinspection ES6UnusedImports
import {observer} from 'mobx-react';
import {BackTop, Layout} from 'antd';
// noinspection ES6UnusedImports
// noinspection ES6UnusedImports
import {Affix, LayoutBreadcrumbs, LayoutFooter, LayoutHeader, LayoutSide, Toolbar} from 'components';
// noinspection ES6UnusedImports
import posed from 'react-pose';
// import './index.scss';
import {LayoutStore, Store} from 'stores';
import {lazyInject} from 'ioc';
import {hot} from 'react-hot-loader';
// noinspection ES6UnusedImports
import {action, observable} from 'mobx'; import { Routes } from 'router';

const { Sider, Header, Content, Footer } = Layout;


type Element = ReactElement | string | number | null;

function h<P>(
    componentOrTag: ComponentType<P> | string,
    children?: ReadonlyArray<Element> | Element
): ReactElement<P>
function h<P >(
    componentOrTag: ComponentType<P> | string,
    properties: P,
    children?: ReadonlyArray<Element> | Element
): ReactElement<P>
    function h(...args:[any,any,any?]):any {
        return _h(...args)
    }
//@formatter:on

export interface DCProps {}


@hot(module)
@observer
export class DC extends Component<DCProps> {
    static displayName                    = 'DC';
    static defaultProps: Partial<DCProps> = {};

    @lazyInject('store.layout') layout: LayoutStore;
    @lazyInject('store') store: Store;

    render() {
        const { children, ...props }                                               = this.props;
        const { container, header, left, middle, content, right, footer, toolbar } = this.layout;

        return h('div', [
            h(Layout, { style: container.computedStyle }, [
                h(LayoutSide, { side: 'left' }),
                h(Layout, [
                    h(LayoutHeader, {}),
                    h(Layout, { style: middle.computedStyle, className: middle.computedClass }, [
                        h(Content, { style: { minHeight: '100%' } }, [
                            // h(Toolbar, {}),
                            h(Layout, { style: { minHeight: `calc(100% - 300px)` } }, [
                                h(Content, { style: middle.computedStyle, className: middle.computedClass }, [
                                    'Haaai',
                                ]),
                            ]),
                        ]),
                    ]),
                    h(LayoutFooter, {}),
                ]),
                h(LayoutSide, { side: 'right' }),
                h(BackTop, {}),
            ]),
        ]);
    }
}

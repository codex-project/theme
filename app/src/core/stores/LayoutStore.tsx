import { action, toJS, transaction } from 'mobx';
import React from 'react';
import { camelCase, set } from 'lodash';
import { colors } from '../utils/colors';
import { app } from '../ioc';
import { classes } from 'typestyle';
import { api } from '@codex/api';
import { createStoreProxy, IStoreProxy } from './proxy';
import { margin, padding } from '../utils/box';
import { MenuItems } from '../menus';
import { injectable } from 'inversify';
import { px } from 'csx';

const log = require('debug')('store:layout');

const colorKeys = Object.keys(colors);

@injectable()
export class LayoutStore {

    // @lazyInject('menumanager') manager: MenuManaer;

    public container: IStoreProxy<LayoutStoreContainer>;
    public left: IStoreProxy<LayoutStoreSide>;
    public right: IStoreProxy<LayoutStoreSide>;
    public middle: IStoreProxy<LayoutStoreMiddle>;
    public content: IStoreProxy<LayoutStoreContent>;
    public header: IStoreProxy<LayoutStoreHeader>;
    public footer: IStoreProxy<LayoutStoreFooter>;
    public toolbar: IStoreProxy<LayoutStoreToolbar>;

    constructor() {
        let self       = this;
        this.container = createStoreProxy<LayoutStoreContainer>({
            class   : {},
            style   : {},
            stretch : true,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style };
                if ( this.stretch ) {
                    style.minHeight = '100vh';
                }
                return style;
            },
        });
        this.left      = createStoreProxy<LayoutStoreSide>({
            class         : {},
            style         : {},
            show          : true,
            width         : 250,
            collapsedWidth: 50,
            collapsed     : false,
            outside       : false,
            color         : null,
            fixed         : false,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            _menu         : [],
            set menu(items) {this._menu = app.menus.apply(items); },
            get menu() {return MenuItems.from(this._menu); },
            setShow(show: boolean) {this.show = show;},
            setCollapsed(collapsed: boolean) {this.collapsed = collapsed;},
            setFixed(fixed: boolean) {this.fixed = fixed;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style };
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;
                // if ( ! this.outside ) style.marginRight = self.middle.padding;
                if ( ! this.show ) style.display = 'none';

                return style;
            },
        });
        this.right     = createStoreProxy<LayoutStoreSide>({
            class         : {},
            style         : {},
            show          : true,
            width         : 200,
            collapsedWidth: 0,
            collapsed     : false,
            outside       : false,
            color         : null,
            fixed         : false,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            _menu         : [],
            set menu(items) {this._menu = app.menus.apply(items); },
            get menu() {return MenuItems.from(this._menu); },
            setShow(show: boolean) {this.show = show;},
            setCollapsed(collapsed: boolean) {this.collapsed = collapsed;},
            setFixed(fixed: boolean) {this.fixed = fixed;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style };
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;
                // if ( ! this.outside ) style.marginLeft = self.middle.padding;
                if ( ! this.show ) style.display = 'none';
                return style;
            },
        });

        this.header = createStoreProxy<LayoutStoreHeader>({
            class            : {},
            style            : {},
            show             : true,
            height           : 64,
            fixed            : false,
            logo             : true,
            color            : null,
            show_left_toggle : false,
            show_right_toggle: false,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            _menu            : [],
            set menu(items) {this._menu = app.menus.apply(items); },
            get menu() {return MenuItems.from(this._menu); },
            setShow(show: boolean) {this.show = show;},
            setFixed(fixed: boolean) {this.fixed = fixed;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style };
                if ( ! this.show ) style.display = 'none';
                if ( this.fixed ) style.position = 'fixed';
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;
                style.height     = this.height;
                style.lineHeight = px(style.lineHeight || style.height as any);
                return style;
            },
        });
        this.footer = createStoreProxy<LayoutStoreFooter>({
            class   : {},
            style   : {},
            show    : true,
            height  : 50,
            fixed   : false,
            color   : null,
            text    : null,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            _menu   : [],
            set menu(items) {this._menu = app.menus.apply(items); },
            get menu() {return MenuItems.from(this._menu); },
            setShow(show: boolean) {this.show = show;},
            setFixed(fixed: boolean) {this.fixed = fixed;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style };
                if ( ! this.show ) style.display = 'none';
                if ( this.fixed ) style.position = 'fixed';
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;
                style.height     = this.height;
                style.lineHeight = px(style.lineHeight || style.height as any);
                return style;
            },
        });

        this.middle  = createStoreProxy<LayoutStoreMiddle>({
            class   : {},
            style   : {},
            padding : 0,
            margin  : 0,
            color   : null,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style, ...padding(this.padding), ...margin(this.margin) };
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;

                return style;
            },
        });
        this.content = createStoreProxy<LayoutStoreContent>({
            class   : {},
            style   : {},
            padding : 0,
            margin  : 0,
            color   : null,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = { ...this.style, ...padding(this.padding), ...margin(this.margin), width: '100%' };
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;

                return style;
            },
        });

        this.toolbar = createStoreProxy<LayoutStoreToolbar>({
            class      : {},
            style      : {},
            color      : null,
            show       : true,
            fixed      : true,
            breadcrumbs: null,
            _children  : null,
            get children() {return Array.isArray(this._children) && this._children.length === 0 ? null : this._children;},
            set children(children: any) {this._children = children;},
            left       : [],
            right      : [],
            setShow(show: boolean) {this.show = show;},
            setFixed(fixed: boolean) {this.fixed = fixed;},
            setClass(value) { if ( ! Array.isArray(value) ) this.class = value; },
            setStyle(value) { if ( ! Array.isArray(value) ) this.style = value; },
            get computedClass(): string {
                let classNames = Object.keys(this.class).filter(className => this.class[ className ] !== false);
                return classes(...classNames);
            },
            get computedStyle(): React.CSSProperties {
                let style: React.CSSProperties = {
                    ...this.style,
                    backgroundColor: self.content.computedStyle.backgroundColor,
                    paddingLeft    : self.content.computedStyle.marginLeft,
                    paddingRight   : self.content.computedStyle.marginRight,
                };
                if ( this.color ) style.backgroundColor = colorKeys.includes(this.color) ? colors[ this.color ] : this.color;
                return style;
            },

        });
        // CookieStorage.has('layout.left.collapsed') && this.left.setCollapsed(parseBool(CookieStorage.get('layout.left.collapsed')));
        // CookieStorage.has('layout.right.collapsed') && this.right.setCollapsed(parseBool(CookieStorage.get('layout.right.collapsed'))); 
    }

    toJS() {
        const { container, left, right, middle, content, header, footer } = this;
        return toJS({ container, left, right, middle, content, header, footer });
    }

    merge(layout: Partial<api.Layout>) {
        layout = toJS(layout);
        log('merge layout', layout);
        console.groupCollapsed('merge layout');
        console.trace('merge layout', layout);
        console.groupEnd();

        Object.keys(layout).forEach(key => {
            if ( ! this[ key ] ) {
                return;
            }
            Object.keys(layout[ key ]).forEach(subKey => {
                let value      = layout[ key ][ subKey ];
                let methodName = camelCase('set_' + subKey);
                if ( typeof this[ key ][ methodName ] === 'function' ) {
                    this[ key ][ methodName ](value);
                } else {
                    this[ key ].set(subKey, value);
                }
            });
        });
    }


    @action set(prop: string, value: any) {
        set(this, prop, value);// prop         = prop.split('.').slice(1).join('.')
    }

    compileMenus() {
        transaction(() => {
            this.header.menu.compile();
            this.left.menu.compile();
            this.right.menu.compile();
            this.footer.menu.compile();
        });
        return this;
    }
}


export type LayoutStorePart<T> = Partial<T> & {
    [ key: string ]: any
    computedClass: string
    computedStyle: React.CSSProperties

    setClass(value: Record<string, boolean>)

    setStyle(value: React.CSSProperties)


    children: []
}


export interface LayoutShowData {
    show: boolean

    setShow(show: boolean)
}

export interface LayoutCollapseData {
    collapsedWidth: number
    collapsed: boolean

    setCollapsed(collapsed: boolean)
}

export interface LayoutColorData {
    color: string | null
}

export interface LayoutMenuData {
    _menu?: Array<api.MenuItem>
    menu: MenuItems
}

export interface LayoutFixedData {
    fixed: boolean

    setFixed(fixed: boolean)
}


export type LayoutStoreContainer = LayoutStorePart<api.LayoutContainer> & {
    stretch: boolean
}
export type LayoutStoreSide = LayoutStorePart<api.LayoutLeft | api.LayoutRight> & LayoutMenuData & LayoutFixedData & LayoutShowData & LayoutCollapseData & LayoutColorData & {
    outside: boolean
    width: number
}
export type LayoutStoreHeader = LayoutStorePart<api.LayoutHeader> & LayoutMenuData & LayoutShowData & LayoutFixedData & LayoutColorData & {
    logo: boolean
    height: number
}
export type LayoutStoreFooter = LayoutStorePart<api.LayoutFooter> & LayoutMenuData & LayoutShowData & LayoutFixedData & LayoutColorData & {
    height: number
    text: string
}
export type LayoutStoreMiddle = LayoutStorePart<api.LayoutMiddle> & LayoutColorData & {
    padding: number | string | number[] | string[]
    margin: number | string | number[] | string[]
}
export type LayoutStoreContent = LayoutStorePart<api.LayoutContent> & LayoutColorData & {
    padding: number | string | number[] | string[]
    margin: number | string | number[] | string[]
}
export type LayoutStoreToolbar = LayoutStorePart<api.LayoutToolbar> & LayoutColorData & LayoutShowData & LayoutFixedData & {
    breadcrumbs: null
    left: any[]
    right: any[]
}

//
// export class LayoutStore {
//     createLayoutPart = createLayoutPart
//
//     constructor(protected store: Store) {
//
//     }
//
//     toJS() {
//         const { left, right, middle, content, header, footer, rightStyle, footerStyle, contentStyle, headerStyle, middleStyle } = this
//         return toJS({ left, right, middle, content, header, footer, rightStyle, footerStyle, contentStyle, headerStyle, middleStyle })
//     }
//
//     @action set(prop: string, value: any) {
//         set(this, prop, value);// prop         = prop.split('.').slice(1).join('.')
//     }
//
//     public left    = createLayoutPart(this, {
//         hide          : false,
//         width         : 250,
//         collapsedWidth: 50,
//         collapsed     : false,
//         setHide(hide: boolean) {this.hide = hide},
//         setCollapsed(collapsed: boolean) {this.collapsed = collapsed}
//     })
//     public right   = createLayoutPart(this, {
//         hide          : true,
//         width         : 200,
//         collapsedWidth: 0,
//         collapsed     : false,
//         setHide(hide: boolean) {this.hide = hide},
//         setCollapsed(collapsed: boolean) {this.collapsed = collapsed}
//     })
//     public middle  = createLayoutPart(this, {
//         padding: '0 24px 24px 24px'
//     })
//     public content = createLayoutPart(this, {})
//     public header  = createLayoutPart(this, {
//         hide  : false,
//         height: 64,
//         fixed : false,
//         logo  : true,
//         setHide(hide: boolean) {this.hide = hide},
//         setFixed(fixed: boolean) {this.fixed = fixed}
//     })
//     public footer  = createLayoutPart(this, {
//         hide  : true,
//         height: 50,
//         fixed : false,
//         setHide(hide: boolean) {this.hide = hide},
//         setFixed(fixed: boolean) {this.fixed = fixed}
//     })
//
//
//     @computed get rightStyle(): React.CSSProperties {
//         const { collapsedWidth, collapsed, width, hide } = this.store.layout.right
//         let style: React.CSSProperties                   = { background: '#FFF', marginLeft: 24 }
//         if ( collapsed ) {
//             style.maxWidth = collapsedWidth
//         } else {
//             style.minWidth = width;
//             style.maxWidth = width;
//         }
//         style.width = collapsed ? collapsedWidth : width;
//
//         if ( hide ) style.display = 'none';
//         return style
//     }
//
//     @computed get middleStyle(): React.CSSProperties {
//         const { padding }              = this.store.layout.middle
//         let style: React.CSSProperties = { padding }
//         return style
//     }
//
//     @computed get contentStyle(): React.CSSProperties {
//         let style: React.CSSProperties = {}
//         return style
//     }
//
//     @computed get footerStyle(): React.CSSProperties {
//         let style: React.CSSProperties = {}
//         const { fixed, height, hide }  = this.store.layout.footer
//         if ( hide ) style.display = 'none';
//         if ( fixed ) style.position = 'fixed'
//         style.maxHeight = height;
//         return style
//     }
//
//     @computed get headerStyle(): React.CSSProperties {
//         let style: React.CSSProperties      = {}
//         const { fixed, height, hide, logo } = this.store.layout.header
//         if ( hide ) style.display = 'none';
//         if ( fixed ) style.position = 'fixed'
//         style.maxHeight = height;
//         return style
//     }
// }

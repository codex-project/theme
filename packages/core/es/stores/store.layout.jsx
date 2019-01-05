var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { action, toJS } from 'mobx';
import { camelCase, set } from 'lodash';
import { colors } from 'utils/colors';
import { app } from 'ioc';
import { classes } from 'typestyle';
import { createStoreProxy } from 'stores/proxy';
import { margin, padding } from 'utils/box';
import { MenuItems } from 'menus';
import { injectable } from 'inversify';
const log = require('debug')('store:layout');
const colorKeys = Object.keys(colors);
let LayoutStore = class LayoutStore {
    constructor() {
        let self = this;
        this.container = createStoreProxy({
            class: {},
            style: {},
            stretch: true,
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style);
                if (this.stretch) {
                    style.minHeight = '100vh';
                }
                return style;
            },
        });
        this.left = createStoreProxy({
            class: {},
            style: {},
            show: true,
            width: 250,
            collapsedWidth: 50,
            collapsed: false,
            outside: false,
            color: null,
            _menu: [],
            set menu(items) { this._menu = app.menus.apply(items); },
            get menu() { return MenuItems.from(this._menu); },
            setShow(show) { this.show = show; },
            setCollapsed(collapsed) { this.collapsed = collapsed; },
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style);
                if (this.color)
                    style.backgroundColor = colorKeys.includes(this.color) ? colors[this.color] : this.color;
                // if ( ! this.outside ) style.marginRight = self.middle.padding;
                if (!this.show)
                    style.display = 'none';
                return style;
            },
        });
        this.right = createStoreProxy({
            class: {},
            style: {},
            show: true,
            width: 200,
            collapsedWidth: 0,
            collapsed: false,
            outside: false,
            color: null,
            _menu: [],
            set menu(items) { this._menu = app.menus.apply(items); },
            get menu() { return MenuItems.from(this._menu); },
            setShow(show) { this.show = show; },
            setCollapsed(collapsed) { this.collapsed = collapsed; },
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style);
                if (this.color)
                    style.backgroundColor = colorKeys.includes(this.color) ? colors[this.color] : this.color;
                // if ( ! this.outside ) style.marginLeft = self.middle.padding;
                if (!this.show)
                    style.display = 'none';
                return style;
            },
        });
        this.header = createStoreProxy({
            class: {},
            style: {},
            show: true,
            height: 64,
            fixed: false,
            logo: true,
            color: null,
            show_left_toggle: false,
            show_right_toggle: false,
            _menu: [],
            set menu(items) { this._menu = app.menus.apply(items); },
            get menu() { return MenuItems.from(this._menu); },
            setShow(show) { this.show = show; },
            setFixed(fixed) { this.fixed = fixed; },
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style);
                if (!this.show)
                    style.display = 'none';
                if (this.fixed)
                    style.position = 'fixed';
                if (this.color)
                    style.backgroundColor = colorKeys.includes(this.color) ? colors[this.color] : this.color;
                style.height = this.height;
                return style;
            },
        });
        this.footer = createStoreProxy({
            class: {},
            style: {},
            show: true,
            height: 50,
            fixed: false,
            color: null,
            _menu: [],
            set menu(items) { this._menu = app.menus.apply(items); },
            get menu() { return MenuItems.from(this._menu); },
            setShow(show) { this.show = show; },
            setFixed(fixed) { this.fixed = fixed; },
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style);
                if (!this.show)
                    style.display = 'none';
                if (this.fixed)
                    style.position = 'fixed';
                if (this.color)
                    style.backgroundColor = colorKeys.includes(this.color) ? colors[this.color] : this.color;
                style.height = this.height;
                return style;
            },
        });
        this.middle = createStoreProxy({
            class: {},
            style: {},
            padding: 0,
            margin: 0,
            color: null,
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style, padding(this.padding), margin(this.margin));
                if (this.color)
                    style.backgroundColor = colorKeys.includes(this.color) ? colors[this.color] : this.color;
                return style;
            },
        });
        this.content = createStoreProxy({
            class: {},
            style: {},
            padding: 0,
            margin: 0,
            color: null,
            setClass(value) { if (!Array.isArray(value))
                this.class = value; },
            setStyle(value) { if (!Array.isArray(value))
                this.style = value; },
            get computedClass() {
                let classNames = Object.keys(this.class).filter(className => this.class[className] !== false);
                return classes(...classNames);
            },
            get computedStyle() {
                let style = Object.assign({}, this.style, padding(this.padding), margin(this.margin));
                if (this.color)
                    style.backgroundColor = colorKeys.includes(this.color) ? colors[this.color] : this.color;
                return style;
            },
        });
    }
    toJS() {
        const { container, left, right, middle, content, header, footer } = this;
        return toJS({ container, left, right, middle, content, header, footer });
    }
    merge(layout) {
        layout = toJS(layout);
        log('merge layout', layout);
        console.groupCollapsed('merge layout');
        console.trace('merge layout', layout);
        console.groupEnd();
        Object.keys(layout).forEach(key => {
            if (!this[key]) {
                return;
            }
            Object.keys(layout[key]).forEach(subKey => {
                let value = layout[key][subKey];
                let methodName = camelCase('set_' + subKey);
                if (typeof this[key][methodName] === 'function') {
                    this[key][methodName](value);
                }
                else {
                    this[key].set(subKey, value);
                }
            });
        });
    }
    set(prop, value) {
        set(this, prop, value); // prop         = prop.split('.').slice(1).join('.')
    }
};
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LayoutStore.prototype, "set", null);
LayoutStore = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], LayoutStore);
export { LayoutStore };
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

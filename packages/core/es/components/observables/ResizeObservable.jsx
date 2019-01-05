var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import React from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { observable } from 'mobx';
import Platform from '../../utils/platform';
import { listenOpts } from '../../utils/event';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';
const log = require('debug')('components:ResizeObservable');
/**
 * ResizeObservable component
 */
let ResizeObservable = class ResizeObservable extends React.Component {
    /**
     * ResizeObservable component
     */
    constructor() {
        super(...arguments);
        this.hasObserver = ResizeObserver !== undefined;
        this.url = Platform.is.ie ? null : 'about:blank';
        this.style = {};
        this.timer = null;
        this.observer = null;
        this.size = { width: -1, height: -1 };
        this.$el = null;
        this.parentNode = null;
        this.onResize = () => {
            this.timer = null;
            if (!this.$el || !this.$el.parentNode) {
                return;
            }
            const parent = this.parentNode, size = {
                width: parent.offsetWidth,
                height: parent.offsetHeight,
            };
            if (size.width === this.size.width && size.height === this.size.height) {
                return;
            }
            this.size = size;
            this.props.onResize(size);
        };
        this.trigger = (immediately = false) => {
            if (immediately || this.props.debounce === 0) {
                this.onResize();
            }
            else if (!this.timer) {
                this.timer = setTimeout(this.onResize, this.props.debounce);
            }
        };
    }
    render() {
        if (this.hasObserver) {
            return <span aria-hidden={true} style={{ display: 'none' }}/>;
        }
        return <object style={this.style} type="text/html" data={this.url} aria-hidden={true} onLoad={(e) => {
            e.currentTarget.contentDocument.defaultView.addEventListener('resize', this.trigger, listenOpts.passive);
            this.trigger(true);
        }}/>;
    }
    componentDidMount() {
        this.size = { width: -1, height: -1 };
        this.hasObserver = typeof ResizeObserver !== 'undefined';
        this.$el = findDOMNode(this);
        this.parentNode = findDOMNode(this).parentNode;
        if (!this.hasObserver) {
            this.style = `${Platform.is.ie ? 'visibility:hidden;' : ''}display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;`;
        }
        if (this.hasObserver) {
            unmountComponentAtNode(this.$el);
            this.$el.outerHTML = '<!-- ResizeObservable -->';
            this.observer = new ResizeObserver(this.trigger);
            this.observer.observe(this.parentNode);
            return;
        }
        this.trigger(true);
        if (Platform.is.ie) {
            this.url = 'about:blank';
        }
    }
    beforeDestroy() {
        clearTimeout(this.timer);
        if (this.hasObserver) {
            this.observer.unobserve(this.parentNode);
            return;
        }
        if (this.$el.contentDocument) {
            this.$el.contentDocument.defaultView.removeEventListener('resize', this.trigger, listenOpts.passive);
        }
    }
};
ResizeObservable.displayName = 'ResizeObservable';
ResizeObservable.defaultProps = {
    debounce: 100,
    onResize: () => null,
};
__decorate([
    observable,
    __metadata("design:type", Boolean)
], ResizeObservable.prototype, "hasObserver", void 0);
__decorate([
    observable,
    __metadata("design:type", String)
], ResizeObservable.prototype, "url", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], ResizeObservable.prototype, "style", void 0);
__decorate([
    observable,
    __metadata("design:type", Number)
], ResizeObservable.prototype, "timer", void 0);
__decorate([
    observable,
    __metadata("design:type", ResizeObserver)
], ResizeObservable.prototype, "observer", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], ResizeObservable.prototype, "size", void 0);
__decorate([
    observable,
    __metadata("design:type", HTMLObjectElement)
], ResizeObservable.prototype, "$el", void 0);
__decorate([
    observable,
    __metadata("design:type", HTMLElement)
], ResizeObservable.prototype, "parentNode", void 0);
ResizeObservable = __decorate([
    hot(module),
    observer
], ResizeObservable);
export { ResizeObservable };

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
import { observable, toJS } from 'mobx';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';
import { getScrollPosition, getScrollTarget } from 'utils/scroll';
import { listenOpts } from 'utils/event';
import { isObject } from 'utils/general';
const log = require('debug')('components:ScrollObservable');
/**
 * ScrollObservable component
 * @see https://github.com/quasarframework/quasar/blob/dev/src/components/observables/QScrollObservable.js
 */
let ScrollObservable = class ScrollObservable extends React.Component {
    /**
     * ScrollObservable component
     * @see https://github.com/quasarframework/quasar/blob/dev/src/components/observables/QScrollObservable.js
     */
    constructor() {
        super(...arguments);
        this.position = 0;
        this.direction = 'down';
        this.directionChanged = false;
        this.inflexionPosition = 0;
        this.getPosition = () => (toJS({
            position: this.position,
            direction: this.direction,
            directionChanged: this.directionChanged,
            inflexionPosition: this.inflexionPosition
        }));
        this.trigger = () => {
            if (!this.timer) {
                this.timer = window.requestAnimationFrame(this.emit);
            }
        };
        this.emit = () => {
            const pos = Math.max(0, getScrollPosition(this.target)), delta = pos - this.position, dir = delta < 0 ? 'up' : 'down';
            this.directionChanged = this.direction !== dir;
            if (this.directionChanged) {
                this.direction = dir;
                this.inflexionPosition = this.position;
            }
            this.timer = null;
            this.position = pos;
            this.props.onScroll(this.getPosition());
        };
    }
    render() {
        return <span aria-hidden={true} style={{ display: 'none' }}/>;
    }
    componentDidMount() {
        this.setTarget();
        this.bind();
        this.trigger();
    }
    componentWillUnmount() {
        this.unbind();
    }
    setTarget() {
        let el = findDOMNode(this);
        let target = this.props.target;
        if (target === 'parent') {
            this.target = el.parentNode;
        }
        else if (isObject(target)) {
            this.target = target;
        }
        else {
            this.target = getScrollTarget(el.parentNode, target);
        }
        unmountComponentAtNode(el);
        el.outerHTML = '<!-- ScrollObservable -->';
    }
    bind() {
        this.target.addEventListener('scroll', this.trigger, listenOpts.passive);
    }
    unbind() {
        this.target.removeEventListener('scroll', this.trigger, listenOpts.passive);
    }
};
ScrollObservable.displayName = 'ScrollObservable';
ScrollObservable.defaultProps = {
    onScroll: () => null
};
__decorate([
    observable,
    __metadata("design:type", Number)
], ScrollObservable.prototype, "position", void 0);
__decorate([
    observable,
    __metadata("design:type", String)
], ScrollObservable.prototype, "direction", void 0);
__decorate([
    observable,
    __metadata("design:type", Boolean)
], ScrollObservable.prototype, "directionChanged", void 0);
__decorate([
    observable,
    __metadata("design:type", Number)
], ScrollObservable.prototype, "inflexionPosition", void 0);
ScrollObservable = __decorate([
    hot(module),
    observer
], ScrollObservable);
export { ScrollObservable };

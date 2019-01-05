var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { listenOpts } from 'utils/event';
const log = require('debug')('components:WindowResizeObservable');
/**
 * WindowResizeObservable component
 */
let WindowResizeObservable = class WindowResizeObservable extends React.Component {
    /**
     * WindowResizeObservable component
     */
    constructor() {
        super(...arguments);
        this.timer = null;
        this.trigger = () => {
            if (this.props.debounce === 0) {
                this.emit();
            }
            else if (!this.timer) {
                this.timer = setTimeout(this.emit, this.props.debounce);
            }
        };
        this.emit = () => {
            this.timer = null;
            this.props.onResize({
                height: window.innerHeight,
                width: window.innerWidth
            });
        };
    }
    render() { return null; }
    componentDidMount() {
        this.emit();
        window.addEventListener('resize', this.trigger, listenOpts.passive);
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
        window.removeEventListener('resize', this.trigger, listenOpts.passive);
    }
};
WindowResizeObservable.displayName = 'WindowResizeObservable';
WindowResizeObservable.defaultProps = {};
WindowResizeObservable = __decorate([
    hot(module),
    observer
], WindowResizeObservable);
export { WindowResizeObservable };

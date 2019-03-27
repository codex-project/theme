import React from 'react';
import { observer } from 'mobx-react';

import { observable, toJS } from 'mobx';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';


import { hot } from 'decorators';
import { isObject } from 'utils/general';
import { getScrollPosition, getScrollTarget } from 'utils/scroll';
import { listenOpts } from 'utils/event';

const log = require('debug')('components:ScrollObservable');

export interface ScrollPosition {
    position: number
    direction: 'up' | 'down'
    directionChanged: boolean
    inflexionPosition: number
}

export interface ScrollObservableProps {
    target?: 'parent' | string | Element
    onScroll: (pos: ScrollPosition) => void
}

/**
 * ScrollObservable component
 * @see https://github.com/quasarframework/quasar/blob/dev/src/components/observables/QScrollObservable.js
 */
@hot(module)
@observer
export class ScrollObservable extends React.Component<ScrollObservableProps> implements ScrollPosition {
    static displayName: string                          = 'ScrollObservable';
    static defaultProps: Partial<ScrollObservableProps> = {
        onScroll: () => null,
    };

    @observable position: number          = 0;
    @observable direction: 'up' | 'down'  = 'down';
    @observable directionChanged: boolean = false;
    @observable inflexionPosition: number = 0;

    target: GlobalEventHandlers;
    timer: number;

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
        let el     = findDOMNode(this) as HTMLElement;
        let target = this.props.target as any;

        if ( target === 'parent' ) {
            this.target = el.parentNode as HTMLElement;
        } else if ( isObject(target) ) {
            this.target = target;
        } else {
            this.target = getScrollTarget(el.parentNode, target) as any;
        }
        unmountComponentAtNode(el);
        el.outerHTML = '<!-- ScrollObservable -->';
    }

    bind() {
        this.target.addEventListener('scroll', this.trigger, listenOpts.passive);
    }

    unbind() {
        this.target.removeEventListener('scroll', this.trigger, listenOpts.passive as any);
    }

    getPosition = (): ScrollPosition => (toJS({
        position         : this.position,
        direction        : this.direction,
        directionChanged : this.directionChanged,
        inflexionPosition: this.inflexionPosition,
    }));

    trigger = () => {
        if ( ! this.timer ) {
            this.timer = window.requestAnimationFrame(this.emit);
        }
    };

    emit = () => {
        const
            pos   = Math.max(0, getScrollPosition(this.target)),
            delta = pos - this.position,
            dir   = delta < 0 ? 'up' : 'down';

        this.directionChanged = this.direction !== dir;
        if ( this.directionChanged ) {
            this.direction         = dir;
            this.inflexionPosition = this.position;
        }

        this.timer    = null;
        this.position = pos;
        this.props.onScroll(this.getPosition());
    };

}

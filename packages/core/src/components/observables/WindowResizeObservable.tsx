import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from '../../decorators';
import { ResizeSize } from '../../interfaces';
import { listenOpts } from '../../utils/event';

const log = require('debug')('components:WindowResizeObservable')


export interface WindowResizeObservableProps {
    debounce?: number
    onResize?: (size: ResizeSize) => void
}

/**
 * WindowResizeObservable component
 */
@hot(module)
@observer
export class WindowResizeObservable extends React.Component<WindowResizeObservableProps> {
    static displayName: string                                = 'WindowResizeObservable'
    static defaultProps: Partial<WindowResizeObservableProps> = {}

    timer: number = null

    render() { return null }

    componentDidMount() {
        this.emit()
        window.addEventListener('resize', this.trigger, listenOpts.passive)
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
        window.removeEventListener('resize', this.trigger, listenOpts.passive as any)
    }

    trigger = () => {
        if ( this.props.debounce === 0 ) {
            this.emit()

        } else if ( ! this.timer ) {
            this.timer = setTimeout(this.emit, this.props.debounce) as any
        }
    }

    emit = () => {
        this.timer = null
        this.props.onResize({
            height: window.innerHeight,
            width : window.innerWidth
        })
    }


}

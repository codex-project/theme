import React from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { observable } from 'mobx';
import Platform from '../../utils/platform';
import { listenOpts } from '../../utils/event';
import { ResizeSize } from '../../interfaces';
import { findDOMNode, unmountComponentAtNode } from 'react-dom';

const log = require('debug')('components:ResizeObservable');


export interface ResizeObservableProps {
    debounce?: number
    onResize?: (size: ResizeSize) => void
}


/**
 * ResizeObservable component
 */
@hot(module)
@observer
export class ResizeObservable extends React.Component<ResizeObservableProps> {
    static displayName: string                          = 'ResizeObservable';
    static defaultProps: Partial<ResizeObservableProps> = {
        debounce: 100,
        onResize: () => null,
    };

    @observable hasObserver: boolean     = ResizeObserver !== undefined;
    @observable url: string              = Platform.is.ie ? null : 'about:blank';
    @observable style: any               = {};
    @observable timer: number            = null;
    @observable observer: ResizeObserver = null;
    @observable size: ResizeSize         = { width: - 1, height: - 1 };
    @observable $el: HTMLObjectElement   = null;
    @observable parentNode: HTMLElement  = null;

    render() {

        if ( this.hasObserver ) {
            return <span aria-hidden={true} style={{ display: 'none' }}/>;
        }

        return <object
            style={this.style}
            type="text/html"
            data={this.url}
            aria-hidden={true}
            onLoad={(e) => {
                e.currentTarget.contentDocument.defaultView.addEventListener('resize', this.trigger as any, listenOpts.passive);
                this.trigger(true);
            }}
        />;
    }

    componentDidMount() {
        this.size        = { width: - 1, height: - 1 };
        this.hasObserver = typeof ResizeObserver !== 'undefined';
        this.$el         = findDOMNode(this) as any;
        this.parentNode  = findDOMNode(this).parentNode as any;

        if ( ! this.hasObserver ) {
            this.style = `${Platform.is.ie ? 'visibility:hidden;' : ''}display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;`;
        }

        if ( this.hasObserver ) {
            unmountComponentAtNode(this.$el);
            this.$el.outerHTML = '<!-- ResizeObservable -->';
            this.observer      = new ResizeObserver(this.trigger as any);
            this.observer.observe(this.parentNode as Element);
            return;
        }

        this.trigger(true);

        if ( Platform.is.ie ) {
            this.url = 'about:blank';
        }
    }

    beforeDestroy() {
        clearTimeout(this.timer);

        if ( this.hasObserver ) {
            this.observer.unobserve(this.parentNode as Element);
            return;
        }

        if ( this.$el.contentDocument ) {
            this.$el.contentDocument.defaultView.removeEventListener('resize', this.trigger as any, listenOpts.passive as any);
        }
    }

    onResize = () => {
        this.timer = null;

        if ( ! this.$el || ! this.$el.parentNode ) {
            return;
        }

        const
            parent           = this.parentNode as HTMLElement,
            size: ResizeSize = {
                width : parent.offsetWidth,
                height: parent.offsetHeight,
            };

        if ( size.width === this.size.width && size.height === this.size.height ) {
            return;
        }

        this.size = size;
        this.props.onResize(size);
    };

    trigger = (immediately: boolean = false) => {
        if ( immediately || this.props.debounce === 0 ) {
            this.onResize();
        } else if ( ! this.timer ) {
            this.timer = setTimeout(this.onResize, this.props.debounce) as any;
        }
    };
}

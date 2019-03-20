import React, { Component, RefObject } from 'react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import ReactGridLayout, { ItemCallback, Layout, WidthProvider } from 'react-grid-layout';

import './grid.scss';
import { observable } from 'mobx';
import { Context } from './Context';

const AutoWidthGridLayout = WidthProvider(ReactGridLayout);

const log = require('debug')('pages:home');


export interface GridProps {}


@hot(module)
@observer
export class Grid extends Component<GridProps> {
    static displayName                      = 'Grid';
    static defaultProps: Partial<GridProps> = {};
    @lazyInject('store') store: Store;

    innerRef: RefObject<ReactGridLayout> = React.createRef<ReactGridLayout>();

    @observable layout: Layout[] = [
        { i: 'a', x: 0, y: 0, w: 1, h: 2 },
        { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
        { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ];

    render() {
        window[ 'grid' ]             = this;
        const { children, ...props } = this.props;

        return (
            <Context.Provider value={this}>
                <AutoWidthGridLayout
                    ref={this.innerRef}
                    className="c-grid"
                    layout={this.layout}
                    cols={12}
                    rows={12}
                    rowHeight={30}
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onDragStop={this.handleDragStop}
                    onResizeStart={this.handleResizeStart}
                    onResize={this.handleResize}
                    onResizeStop={this.handleResizeStop}
                >

                    {React.Children.map(this.props.children, child =>
                        this.processGridItem(child),
                    )}
                </AutoWidthGridLayout>
            </Context.Provider>
        );
    }

    processGridItem(item) {
        return item;
    }

    handleDragStart: ItemCallback   = (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {};
    handleDrag: ItemCallback        = (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {};
    handleDragStop: ItemCallback    = (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {};
    handleResizeStart: ItemCallback = (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {};
    handleResize: ItemCallback      = (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {};
    handleResizeStop: ItemCallback  = (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {};
}

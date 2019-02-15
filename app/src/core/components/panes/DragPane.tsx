import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Pane,PaneProps } from 'components/panes/Pane';
import { ConnectDragSource, DragSource } from 'react-dnd';
import { getElementType } from 'utils/getElementType';


interface CollectedProps {
    connectDragSource: ConnectDragSource
    isDragging?: boolean
}

export interface DragPaneBaseProps {}

export type DragPaneProps = DragPaneBaseProps & PaneProps

@hot(module)
@(DragSource<DragPaneProps, CollectedProps>(
    'pane',
    {
        beginDrag: (props, monitor, component) => {
            return {};
        },
    },
    (connect, monitor) => {
        return {
            // Call this function inside render()
            // to let React DnD handle the drag events:
            connectDragSource: connect.dragSource(),
            // You can ask the monitor about the current drag state:
            isDragging       : monitor.isDragging(),
        };
    }) as any)
export default class DragPane extends Pane<DragPaneProps & Partial<CollectedProps>> {
    static displayName?                          = 'DragPane';
    static defaultProps?: Partial<DragPaneProps> = Pane.defaultProps;

    render() {
        const { children, index, connectDragSource, isDragging, style, ...props } = this.props;
        return connectDragSource(super.render());
    }
}


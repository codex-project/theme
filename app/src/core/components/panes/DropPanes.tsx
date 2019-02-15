import React from 'react';
import { ConnectDropTarget, DropTarget } from 'react-dnd';
import { Panes, PanesProps } from 'components/panes/Panes';
import { hot } from 'react-hot-loader';
const log = require('debug')('components:panes:DropPanes');
export interface CollectedProps {
    isOver: boolean
    canDrop: boolean
    connectDropTarget: ConnectDropTarget
}

export interface DropPanesBaseProps {}

export type DropPanesProps = DropPanesBaseProps & PanesProps

@hot(module)
@(DropTarget<DropPanesProps, CollectedProps>(
    'panes',
    {
        canDrop: (props, monitor) => {
            return true;
        },
        drop   : (props, monitor, component) => {
            log('drop',{props,monitor,component})
        },
    },
    (connect, monitor) => {
        return {
            connectDropTarget: connect.dropTarget(),
            isOver           : ! ! monitor.isOver(),
            canDrop          : monitor.canDrop(),
        };
    }) as any)
export default class DropPanes extends Panes<DropPanesProps & Partial<CollectedProps>> {
    static displayName?: string                   = 'DropPanes';
    static defaultProps?: Partial<DropPanesProps> = Panes.defaultProps;

    render() {
        const { children, canDrop, connectDropTarget, isOver, ...props } = this.props;
        return connectDropTarget(super.render());
    }
}


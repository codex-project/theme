import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { PanesProps } from 'components/panes/Panes';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DropPanes from 'components/panes/DropPanes';

export interface DragDropPanesBaseProps {}

export type DragDropPanesProps = DragDropPanesBaseProps & PanesProps

@hot(module)
@DragDropContext(HTML5Backend)
export class DragDropPanes extends Component<DragDropPanesProps> {
    static displayName                               = 'DragDropPanes';
    static defaultProps: Partial<DragDropPanesProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <DropPanes {...props}>
                {children}
            </DropPanes>
        );
    }
}


// export default hot(module)<DragDropPanes>(DragDropContext(HTML5Backend)(DragDropPanes) as any);

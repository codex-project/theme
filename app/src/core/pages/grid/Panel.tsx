import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import { Context } from 'pages/grid/Context';
import { GridItem, GridItemProps } from 'pages/grid/GridItem';
import classNames from 'classnames';

export interface PanelProps extends GridItemProps {}

@hot(module)
@observer
export class Panel extends Component<PanelProps> {
    static displayName                       = 'Panel';
    static defaultProps: Partial<PanelProps> = {};
    static contextType                       = Context;
    context!: React.ContextType<typeof Context>;

    render() {
        const { children, className, ...props } = this.props;

        return (
            <GridItem
                className={classNames('c-grid-panel',className)}
                {...props}
            >
                {children}
            </GridItem>
        );
    }
}


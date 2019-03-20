import React, { Component } from 'react';
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { Context } from 'pages/grid/Context';
import classNames from 'classnames';

export interface GridItemProps {
    className?:string
    style?:React.CSSProperties
}


@hot(module)
@observer
export class GridItem extends Component<GridItemProps> {
    static displayName                          = 'GridItem';
    static defaultProps: Partial<GridItemProps> = {};
    static contextType                        = Context;
    context!: React.ContextType<typeof Context>;

    render() {
        const { children, className, ...props } = this.props;

        return (
            <div
                className={classNames('c-grid-item',className)}
                {...props}
            >
                {children}
            </div>
        );
    }
}

import React, { Component } from 'react';
import { getElementType } from 'utils/getElementType';

export interface TaskListProps extends React.HTMLAttributes<HTMLUListElement> {
    as?: string
}

export class TaskList extends Component<TaskListProps> {
    static displayName                          = 'TaskList';
    static defaultProps: Partial<TaskListProps> = {
        as: 'ul',
    };

    render() {
        const { children, ...props } = this.props;
        const ElementType            = getElementType(TaskList, this.props);

        return (
            <ElementType>
                {children}
            </ElementType>
        );
    }
}

export interface TaskListItemProps extends React.HTMLAttributes<HTMLLIElement> {
    as?: string
    checked?: boolean
}

export class TaskListItem extends Component<TaskListItemProps> {
    static displayName                              = 'TaskListItem';
    static defaultProps: Partial<TaskListItemProps> = {
        as     : 'li',
        checked: false,
    };

    state = { checked: this.props.checked };

    setChecked = (checked: boolean) => this.setState({ checked });

    render() {
        const { children, ...props } = this.props;
        return (
            <li>
                <input
                    type="checkbox"
                    checked={this.state.checked}
                    onChange={event1 => this.setChecked(event1.target.checked)}
                />
                {children}
            </li>
        );
    }
}

export default TaskListItem;

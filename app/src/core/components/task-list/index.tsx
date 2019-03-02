import React, { Component } from 'react';
import { getElementType } from 'utils/getElementType';


import './task-list.scss'
import { Checkbox } from 'antd';

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
            <ElementType className="c-task-list">
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
            <li className="c-task-list-item">
                <Checkbox
                    className="c-task-list-item-checkbox"
                    checked={this.state.checked}
                    onChange={event1 => {
                        this.setChecked(event1.target.checked);
                        event1.nativeEvent.target['blur']()
                    }}
                />
                {children}
            </li>
        );
    }
}

export default TaskListItem;

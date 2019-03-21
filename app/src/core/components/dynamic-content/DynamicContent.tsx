import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';


interface IDynamicContent {
    type:string

}

export interface DynamicContentProps {}

@hot(module)
@observer
export default class DynamicContent extends Component<DynamicContentProps> {
    static displayName                                = 'DynamicContent';
    static defaultProps: Partial<DynamicContentProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                {children}
            </div>
        );
    }
}

export namespace DynamicContent {

    export interface IToolbarItem {
        type:string
    }
    export interface IToolbar {
        items

    }
}

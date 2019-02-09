import React, { Component } from 'react';
import {getElementType} from 'utils/getElementType';

export interface TriggerProps {
    as?: React.ReactType
    listenTo: string[]
}

export class Trigger extends Component<TriggerProps> {
    static displayName                         = 'Trigger';
    static defaultProps: Partial<TriggerProps> = {
        as: 'span',
    };

    componentDidMount() {
        //
    }

    render() {
        let { listenTo, children, ...rest } = this.props;
        let spanProps: any                  = {};
        listenTo.map(eventName => {
            spanProps[ eventName ] = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props[ eventName ] ? this.props[ eventName ](e) : null;
            };
        });
        const ElementType = getElementType(Trigger, this.props);
        return <ElementType {...rest} {...spanProps}>{children}</ElementType>;
    }
}

export default Trigger;


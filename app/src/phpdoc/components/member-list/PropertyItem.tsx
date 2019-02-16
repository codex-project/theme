import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { PhpdocProperty } from '../../logic';
import { Tooltip } from 'antd';
import { ListContext } from './ListContext';
import PhpdocType from '../type';

export interface PropertyItemProps {
    item: PhpdocProperty
    selected?:boolean
    hide?: {
        visibility?: boolean
        types?: boolean
    }
}

@hot(module)
export default class PropertyItem extends Component<PropertyItemProps> {
    static displayName                              = 'PropertyItem';
    static defaultProps: Partial<PropertyItemProps> = {
        hide: {},
    };
    static contextType                             = ListContext;
    context!: React.ContextType<typeof ListContext>;

    render() {
        const { children, item, hide, ...props } = this.props;
        let selected = this.context.list.isSelected(item)
        return (
            <Fragment>
                {! hide.visibility ? <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip> : null}
                <span className="token property">{item.name}</span>
                {! hide.types && item.types ? <PhpdocType className='phpdoc-member-list-item-property-type' type={item.types}/> : null}
            </Fragment>
        );
    }
}


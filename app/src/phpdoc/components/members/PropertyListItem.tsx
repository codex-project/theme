import React, { Component } from 'react';
import { PhpdocProperty } from '../../logic';
import { Tooltip } from 'antd';
import { PhpdocType } from '../type';
import { ListItem, ListItemProps } from './ListItem';
import { MembersContext } from './MembersContext';

export interface PropertyListItemProps extends ListItemProps {
    item: PhpdocProperty
    hide?: {
        visibility?: boolean
        types?: boolean
    }
}


export class PropertyListItem extends Component<PropertyListItemProps> {
    static displayName                                  = 'PropertyItem';
    static defaultProps: Partial<PropertyListItemProps> = {
        hide: {},
    };
    static contextType                                  = MembersContext;
    context!: React.ContextType<typeof MembersContext>;

    render() {
        const { children, item, hide, ...props } = this.props;
        return (
            <ListItem {...props} item={item}>
                <If condition={! hide.visibility}>
                    <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                </If>

                <span className="token property">{item.name}</span>

                <If condition={! hide.types && item.types}>
                    <PhpdocType className='phpdoc-member-list-item-property-type' type={item.types}/>
                </If>
            </ListItem>
        );
    }
}


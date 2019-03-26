import React, { Component } from 'react';
import { PhpdocMethodSignature } from '../method';
import { Tooltip } from 'antd';
import { ListItem, ListItemProps } from './ListItem';
import { MembersContext } from './MembersContext';
import { PhpdocMethodSignatureProps } from '../method/PhpdocMethodSignature';
import { cold } from 'react-hot-loader';
import { observer } from 'mobx-react';

export interface MethodListItemProps extends ListItemProps {
    hide?: PhpdocMethodSignatureProps['hide'] & {
        visibility?: boolean
    }
}
export class MethodListItem extends Component<MethodListItemProps> {
    static displayName                                = 'MethodItem';
    static defaultProps: Partial<MethodListItemProps> = {
        hide: {},
    };
    static contextType                                = MembersContext;
    context!: React.ContextType<typeof MembersContext>;

    render() {
        const { children, selected, item, ...props } = this.props;

        let hide: PhpdocMethodSignatureProps['hide'] = {
            deprecated      : false,
            modifiers       : false,
            namespace       : false,
            // typeTooltip     : false,
            argumentDefaults: ! selected, //true,
            argumentTypes   : ! selected, //true,
            returns         : ! selected, //true,
            ...this.props.hide || {},
            visibility      : true,
            inherited       : true,

        };

        return (
            <ListItem {...props} selected={selected} item={item}>
                <If condition={! this.props.hide.visibility}>
                    <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip>
                </If>
                <PhpdocMethodSignature
                    fqsen={item.fqsen}
                    file={this.context.file}
                    inline={true}
                    size={12}
                    noClick={true}
                    hide={hide}
                />
            </ListItem>
        );
    }
}


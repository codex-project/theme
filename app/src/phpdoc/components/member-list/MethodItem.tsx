import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { PhpdocMethod } from '../../logic';
import { Tooltip } from 'antd';
import { PhpdocMethodSignature } from '../method';
import { ListContext } from './ListContext';

export interface MethodItemProps {
    item: PhpdocMethod
    selected?: boolean
    hide?: {
        visibility?: boolean
    }
}

@hot(module)
export default class MethodItem extends Component<MethodItemProps> {
    static displayName                            = 'MethodItem';
    static defaultProps: Partial<MethodItemProps> = {
        hide: {},
    };
    static contextType                            = ListContext;
    context!: React.ContextType<typeof ListContext>;

    render() {
        const { children, item, hide, ...props } = this.props;
        let selected = this.context.list.isSelected(item)
        return (
            <Fragment>
                {! hide.visibility ? <Tooltip title={item.visibility}> <i className={'phpdoc-visibility-' + item.visibility}/> </Tooltip> : null}
                <PhpdocMethodSignature
                    fqsen={item.fqsen}
                    file={this.context.file}
                    inline={true}
                    size={12}
                    noClick={true}
                    hide={{
                        deprecated      : true,
                        inherited       : true,
                        modifiers       : true,
                        argumentDefaults: ! selected, //true,
                        namespace       : true,
                        argumentTypes   : ! selected, //true,
                        typeTooltip     : true,
                        returns         : ! selected, //true,
                    }}
                />
            </Fragment>
        );
    }
}


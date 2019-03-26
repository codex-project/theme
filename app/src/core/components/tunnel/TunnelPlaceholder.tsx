import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';

export interface TunnelPlaceholderProps {
    children?: () => any
    component?: React.ComponentType<any>
    id: string
    multiple?: boolean
    delay?: number
}

export class TunnelPlaceholder extends PureComponent<TunnelPlaceholderProps> {
    static defaultProps: Partial<TunnelPlaceholderProps> = {
        component: Fragment,
        delay    : 1,
    };

    static contextTypes = {
        tunnelState: PropTypes.object,
    };

    componentDidMount() {
        const { id }          = this.props;
        const { tunnelState } = this.context;
        tunnelState.subscribe(id, this.handlePropsChange);
    }

    componentWillUnmount() {
        const { id }          = this.props;
        const { tunnelState } = this.context;
        tunnelState.unsubscribe(id, this.handlePropsChange);
    }

    handlePropsChange = () => {
        setTimeout(() => this.forceUpdate(), this.props.delay);
    };

    render() {
        const { tunnelState } = this.context;
        const {
                  id,
                  children : renderChildren,
                  component: Tag,
                  multiple,
              }               = this.props;
        const tunnelProps     = tunnelState.getTunnelProps(id);

        if ( renderChildren ) {
            if ( Array.isArray(tunnelProps) || multiple ) {
                return ! tunnelProps
                       ? (renderChildren as any)({ items: [] })
                       : (renderChildren as any)({
                        items: Array.isArray(tunnelProps) ? tunnelProps : [ tunnelProps ],
                    });
            } else {
                return (renderChildren as any)(tunnelProps || {});
            }
        }

        if ( ! tunnelProps ) {
            return null;
        }

        return <Tag>{tunnelProps.children}</Tag>;
    }
}

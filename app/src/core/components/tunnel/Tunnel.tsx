import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { hot } from 'decorators';
import { uniqueId } from 'utils/general';

export interface TunnelProps {
    id?: string
    render?: Function
}

@hot(module)
export class Tunnel extends Component<TunnelProps> {
    static contextTypes = {
        tunnelState: PropTypes.object,
    };

    itemId = uniqueId();

    componentDidMount() {
        this.setTunnelProps(this.props);
    }

    componentDidUpdate() {
        this.setTunnelProps(this.props);
    }

    componentWillUnmount() {
        const { id }          = this.props;
        const { tunnelState } = this.context;
        tunnelState.setTunnelProps(id, this.itemId, null);
    }

    setTunnelProps(newProps) {
        const { id, ...props } = newProps;
        const { tunnelState }  = this.context;
        tunnelState.setTunnelProps(id, this.itemId, props);
    }

    render() {
        return null;
    }
}


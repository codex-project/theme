import PropTypes from 'prop-types'
import React,{ Children, Component } from 'react'
import {TunnelState} from './TunnelState'
import { hot } from 'decorators';


export interface TunnelProviderProps {
}

@hot(module)
export class TunnelProvider extends Component<TunnelProviderProps> {
    static propTypes = {
        children: PropTypes.node,
    }

    static childContextTypes = {
        tunnelState: PropTypes.object,
    }

    tunnelState = new TunnelState()

    getChildContext() {
        return {
            tunnelState: this.tunnelState,
        }
    }

    render() {
        return Children.only(this.props.children)
    }
}

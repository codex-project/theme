import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { hot } from 'decorators';

export interface TunnelPlaceholderProps {
    children?:() => any
    component?:React.ComponentType<any>
    id:string
    multiple?:boolean
}

@hot(module)
export class TunnelPlaceholder extends Component<TunnelPlaceholderProps> {
    static defaultProps = {
        component: Fragment,
    }

    static contextTypes = {
        tunnelState: PropTypes.object,
    }

    componentDidMount() {
        const { id } = this.props
        const { tunnelState } = this.context
        tunnelState.subscribe(id, this.handlePropsChange)
    }

    componentWillUnmount() {
        const { id } = this.props
        const { tunnelState } = this.context
        tunnelState.unsubscribe(id, this.handlePropsChange)
    }

    handlePropsChange = () => {
        this.forceUpdate()
    }

    render() {
        const { tunnelState } = this.context
        const {
                  id,
                  children: renderChildren,
                  component: Tag,
                  multiple,
              } = this.props
        const tunnelProps = tunnelState.getTunnelProps(id)

        if (renderChildren) {
            if (Array.isArray(tunnelProps) || multiple) {
                return !tunnelProps
                       ? (renderChildren as any)({ items: [] })
                       : (renderChildren as any)({
                        items: Array.isArray(tunnelProps) ? tunnelProps : [tunnelProps],
                    })
            } else {
                return (renderChildren as any)(tunnelProps || {})
            }
        }

        if (!tunnelProps) {
            return null
        }

        return <Tag>{tunnelProps.children}</Tag>
    }
}
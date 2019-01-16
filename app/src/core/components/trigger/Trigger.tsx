import * as React from 'react';

export class Trigger extends React.Component<{ listenTo: string[] }> {
    componentDidMount(){
        //
    }
    render() {
        let {listenTo,children, ...rest} = this.props
        let spanProps: any = {}
        listenTo.map(eventName => {
            spanProps[ eventName ] = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.props[ eventName ] ? this.props[ eventName ](e) : null;
            }
        })
        return <span {...rest} {...spanProps}>{children}</span>
    }
}


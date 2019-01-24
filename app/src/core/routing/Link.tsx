import React, { Component } from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to?: any
}

export class Link extends Component<LinkProps> {
    static displayName                      = 'Link';
    static defaultProps: Partial<LinkProps> = {};

    render() {
        const { children, to, ...props } = this.props;

        return (
            <a
                {...props}>
                {children}
            </a>
        );
    }
}

export default Link;

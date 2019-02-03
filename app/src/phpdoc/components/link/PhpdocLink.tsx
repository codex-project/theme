import React, { Component } from 'react';
import { hot } from '@codex/core';

export interface PhpdocLinkProps {}
export {PhpdocLink}

@hot(module)
export default class PhpdocLink extends Component<PhpdocLinkProps> {
    static displayName                            = 'PhpdocLink';
    static defaultProps: Partial<PhpdocLinkProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <a className="phpdoc-link">
                {children}
            </a>
        );
    }
}


import React, { Component } from 'react';

export interface TestImportComponentProps {}

export class TestImportComponent extends Component<TestImportComponentProps> {
    static displayName                                     = 'TestImportComponent';
    static defaultProps: Partial<TestImportComponentProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div {...props}>TestImportComponent</div>
        );
    }
}


// export default TestImportComponent;

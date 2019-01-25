import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { RouteLoadedComponentProps } from './routes';

const log = require('debug')('router:DocumentPage');
export interface DocumentPageProps extends RouteLoadedComponentProps<{}> {

}

@observer
export class DocumentPage extends Component<DocumentPageProps> {
    static displayName                          = 'DocumentPage';
    static defaultProps: Partial<DocumentPageProps> = {

    };

    render() {
        const { children, ...props } = this.props;
        log('render', this)
        return (
            <div>
                <h2>DocumentPage</h2>
                {children}
            </div>
        );
    }
}

export default DocumentPage;

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { colors } from 'utils/colors';
import { hot, WithRouter } from 'decorators';
import { Button, Col, Row } from 'antd';
const log = require('debug')('components:ErrorBoundary');
const Title = (props) => <h4 style={{ textAlign: 'center' }} {...props}/>;
const Message = (props) => <p style={{ textAlign: 'center', color: colors['red-7'] }} {...props}/>;
const Stack = (props) => (<div className={props.className}>
        {props.title ? <h6>{props.title}</h6> : null}
        <pre>{props.children}</pre>
    </div>);
const Stacks = (props) => (<div style={{ maxHeight: 350, overflowY: 'scroll' }}>
        <Stack title={props.error.name + ' Stacktrace:'}>{props.error.stack}</Stack>
        <Stack title="Component Stacktrace:">{props.errorInfo.componentStack}</Stack>
    </div>);
let ErrorBoundary = class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.unregisterLocationListener = null;
        this.state = { hasError: false };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true, error, errorInfo });
        log('ERROR BOUNDARY', { error, errorInfo });
    }
    componentDidMount() {
        this.unregisterLocationListener = this.props.history.listen((location, action) => {
            if (this.state.hasError) {
                this.setState({ hasError: false });
            }
        });
    }
    componentWillUnmount() {
        this.unregisterLocationListener();
    }
    render() {
        let { title, showStacks, goBackText, withError } = this.props;
        let { error, errorInfo, hasError } = this.state;
        if (hasError || withError) {
            error = error || withError;
            log('error', { error });
            return (<Row type="flex">
                    <Col xs={24} md={{ span: 12, offset: 6 }}>
                        <Title>{title}</Title>
                        <Message>{error.message}</Message>
                        <Message>{error.linkback ? <Button onClick={e => this.props.history.goBack()}>{goBackText}</Button> : null}</Message>
                        {showStacks ? <Stacks error={error} errorInfo={errorInfo}/> : null}
                    </Col>
                </Row>);
        }
        return React.Children.only(this.props.children);
    }
};
ErrorBoundary.displayName = 'ErrorBoundary';
ErrorBoundary.defaultProps = {
    title: 'Whoops..',
    goBackText: 'Return to previous page'
};
ErrorBoundary = __decorate([
    hot(module, false),
    WithRouter()
], ErrorBoundary);
export { ErrorBoundary };

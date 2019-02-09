import React, { Component, ErrorInfo } from 'react';
import { UnregisterCallback } from 'history';
import { Button, Col, Row } from 'antd';
import { colors } from 'utils/colors';
import { hot, WithRouter, WithRouterProps } from 'decorators';

export interface ErrorBoundaryProps {
    title?: string
    showStacks?: boolean
    goBackText?: string
    withError?: SomeError
}

interface SomeError extends Error {
    [ key: string ]: any
}

interface State {
    hasError: boolean
    error?: SomeError
    errorInfo?: ErrorInfo
}

const log = require('debug')('components:ErrorBoundary');

const Title = (props) => <h4 style={{ textAlign: 'center' }} {...props}/>

const Message = (props) => <p style={{ textAlign: 'center', color: colors[ 'red-7' ] }} {...props}/>

const Stack = (props: { children: any, title?: string, className?: string }) => (
    <div className={props.className}>
        {props.title ? <h6>{props.title}</h6> : null}
        <pre>{props.children}</pre>
    </div>
)

const Stacks = (props: { error: SomeError, errorInfo: ErrorInfo, className?: string }) => (
    <div style={{ maxHeight: 350, overflowY: 'scroll' }}>
        <Stack title={props.error.name + ' Stacktrace:'}>{props.error.stack}</Stack>
        <Stack title="Component Stacktrace:">{props.errorInfo.componentStack}</Stack>
    </div>
)

@hot(module, false)
@WithRouter()
export class ErrorBoundary extends Component<ErrorBoundaryProps & WithRouterProps, State> {
    static displayName                               = 'ErrorBoundary';
    static defaultProps: Partial<ErrorBoundaryProps> = {
        title     : 'Whoops..',
        goBackText: 'Return to previous page'
    }

    protected unregisterLocationListener: UnregisterCallback = null;

    state: State = { hasError: false }

    componentDidCatch(error: SomeError, errorInfo: ErrorInfo) {
        this.setState({ hasError: true, error, errorInfo });
        log('ERROR BOUNDARY', { error, errorInfo });
    }

    componentDidMount() {
        this.unregisterLocationListener = this.props.history.listen((location, action) => {
            if ( this.state.hasError ) {
                this.setState({ hasError: false })
            }
        });
    }

    componentWillUnmount() {
        this.unregisterLocationListener();
    }

    static getDerivedStateFromError(){
        return {hasError:true}
    }

    render() {
        let { title, showStacks, goBackText, withError } = this.props
        let { error, errorInfo, hasError }               = this.state
        if ( hasError || withError ) {
            error = error || withError;
            log('error', { error })
            return (
                <Row type="flex">
                    <Col xs={24} md={{ span: 12, offset: 6 }}>
                        <Title>{title}</Title>
                        <Message>{error.message}</Message>
                        <Message>{error.linkback ? <Button onClick={e => this.props.history.goBack()}>{goBackText}</Button> : null}</Message>
                        {showStacks ? <Stacks error={error} errorInfo={errorInfo}/> : null}
                    </Col>
                </Row>
            )
        }
        return React.Children.only(this.props.children);
    }
}

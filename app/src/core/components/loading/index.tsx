import * as React from 'react';
import { Spin, SpinProps } from '../../components/spin';
import { LoadingComponentProps } from 'react-loadable';
import { cold, hot } from 'decorators';
import { noop } from 'lodash';
import './index.mscss';

const log = require('debug')('component:Loading');

export interface LoadingProps extends LoadingBaseProps, LoadingComponentProps {}

export interface LoadingBaseProps {
    className?: string
    style?: React.CSSProperties
    spin?: SpinProps
    errorText?: React.ReactNode
    timeoutText?: React.ReactNode
    loadingText?: React.ReactNode
}

export const renderLoading = (props: LoadingBaseProps) => <Loading isLoading={true} pastDelay={true} timedOut={false} error={false} retry={noop} {...props}/>;

export class Loading extends React.PureComponent<LoadingProps> {
    static displayName                         = 'Loading';
    static defaultProps: Partial<LoadingProps> = {
        errorText  : 'Error!',
        timeoutText: 'Request timed out...',
        loadingText: 'Loading...',
    };

    render() {
        const { error, pastDelay, isLoading, timedOut, spin, className, style } = this.props;
        const { errorText, timeoutText, loadingText }                           = this.props;
        if ( error ) {
            log('error', error);
            return <div className={className} style={style}>{errorText}</div>;
        } else if ( timedOut ) {
            return <div className={className} style={style}>{timeoutText}</div>;
        } else if ( pastDelay && isLoading ) {
            return (
                <div styleName="wrapper" className={className} style={style}>
                    <Spin styleName="spin" {...spin || { iconStyle: { fontSize: '5em' } }} />
                    <If condition={loadingText}>
                        <div styleName="text">{loadingText}</div>
                    </If>
                </div>
            );
        }
        return null;
    }
}

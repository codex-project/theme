import * as React from 'react';
import { Spin, SpinProps } from '../spin';
import { LoadingComponentProps } from 'react-loadable';

import { noop } from 'lodash';
import './loading.scss';
import { classes } from 'typestyle';

const log = require('debug')('component:Loading');

export interface LoadingProps extends LoadingBaseProps, LoadingComponentProps {}

export interface LoadingBaseProps {
    className?: string
    style?: React.CSSProperties
    spin?: SpinProps
    errorText?: React.ReactNode
    timeoutText?: React.ReactNode
    loadingText?: React.ReactNode
    prefixCls?:string
}

export const renderLoading = (props: LoadingBaseProps) => <Loading isLoading={true} pastDelay={true} timedOut={false} error={false} retry={noop} {...props}/>;

export class Loading extends React.PureComponent<LoadingProps> {
    static displayName                         = 'Loading';
    static defaultProps: Partial<LoadingProps> = {
        prefixCls: 'c-loading',
        errorText  : 'Error!',
        timeoutText: 'Request timed out...',
        loadingText: 'Loading...',
    };

    render() {
        const { error, pastDelay, isLoading, prefixCls,timedOut, spin, style } = this.props;
        const { errorText, timeoutText, loadingText }                           = this.props;
        let classNames = classes(prefixCls, this.props.className);

        if ( error ) {
            log('error', error);
            return <div className={classNames} style={style}>{errorText}</div>;
        } else if ( timedOut ) {
            return <div className={classNames} style={style}>{timeoutText}</div>;
        } else if ( pastDelay && isLoading ) {
            return (
                <div className={classNames} style={style}>
                    <Spin className={prefixCls + '-spin'} {...spin || { iconStyle: { fontSize: '5em' } }} />
                    <If condition={loadingText}>
                        <div className={prefixCls + '-text'}>{loadingText}</div>
                    </If>
                </div>
            );
        }
        return null;
    }
}

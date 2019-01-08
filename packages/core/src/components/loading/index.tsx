import * as React from 'react';
import { Spin, SpinProps } from '../../components/spin';
import { LoadingComponentProps } from 'react-loadable';
import { hot } from '../../decorators';
import { noop } from 'lodash';
import './index.mscss';

const log = require('debug')('component:Loading');

export interface LoadingProps extends LoadingComponentProps {
    className?: string
    spin?: SpinProps
}

export const renderLoading = (className: string = '') => <Loading className={className} isLoading={true} pastDelay={true} timedOut={false} error={false} retry={noop}/>;

@hot(module)
export class Loading extends React.PureComponent<LoadingProps> {
    static displayName = 'Loading';

    render() {
        const { error, pastDelay, isLoading, timedOut, spin, className } = this.props;
        if ( error ) {
            log('error', error);
            return <div className={className}>Error!</div>;
        } else if ( timedOut ) {
            return <div className={className}>Request timed out...</div>;
        }
        return (
            <div styleName="wrapper" className={className}>
                <Spin styleName="spin" {...spin || { iconStyle: { fontSize: '5em' } }} />
                <div styleName="text">Loading...</div>
            </div>
        );
    }
}

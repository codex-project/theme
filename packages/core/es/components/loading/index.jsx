var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { Spin } from 'components/spin';
import { hot } from 'decorators';
import { noop } from 'lodash';
import './index.mscss';
const log = require('debug')('component:Loading');
export const renderLoading = (className = '') => <Loading className={className} isLoading={true} pastDelay={true} timedOut={false} error={false} retry={noop}/>;
let Loading = class Loading extends React.PureComponent {
    render() {
        const { error, pastDelay, isLoading, timedOut, spin, className } = this.props;
        if (error) {
            log('error', error);
            return <div className={className}>Error!</div>;
        }
        else if (timedOut) {
            return <div className={className}>Request timed out...</div>;
        }
        return (<div styleName="wrapper" className={className}>
                <Spin styleName="spin" {...spin || { iconStyle: { fontSize: '5em' } }}/>
                <div styleName="text">Loading...</div>
            </div>);
    }
};
Loading.displayName = 'Loading';
Loading = __decorate([
    hot(module)
], Loading);
export { Loading };

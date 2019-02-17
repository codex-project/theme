//@ts-ignore TS2307
import React from 'react';
import './member-list.scss';
import { hot } from 'react-hot-loader';
import TabbedMemberList, { TabbedMemberListProps } from './TabbedMemberList';


const log = require('debug')('phpdoc:components:PhpdocMemberList');
export interface PhpdocMemberListProps extends TabbedMemberListProps{

}
@hot(module)
export default class PhpdocMemberList extends React.Component<TabbedMemberListProps> {
    static displayName: string = 'PhpdocMemberList';

    render() {
        return <TabbedMemberList {...this.props}/>;
    }
}

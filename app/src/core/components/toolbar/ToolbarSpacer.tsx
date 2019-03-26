import React from 'react';
import { classes } from 'typestyle';
import { strEnsureLeft } from 'utils/general';

const prefixCls  = 'c-toolbar';
const classNames = (...names: string[]) => classes(...names.filter(Boolean).map(name => strEnsureLeft(name, prefixCls + '-')));

export const ToolbarSpacer = (props) => <div className={classNames('spacer')} style={{ flexGrow: 10 }}/>;

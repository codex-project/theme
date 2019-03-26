import { Col, ColProps as ToolbarColumnProps } from 'antd/lib/grid';
import React from 'react';
import { classes } from 'typestyle';
import { strEnsureLeft } from 'utils/general';

const prefixCls  = 'c-toolbar';
const classNames = (...names: string[]) => classes(...names.filter(Boolean).map(name => strEnsureLeft(name, prefixCls + '-')));


export { ToolbarColumnProps };
export const ToolbarColumn = (props: ToolbarColumnProps) => <Col className={classNames('column')} {...props} />;

import { AffixProps } from 'antd/lib/affix';
import { Affix as AntdAffix } from 'antd';
import { Fragment } from 'react';
import React from 'react';

export const Affix = ({ enabled, children, ...props }: AffixProps & { children?: any, enabled?: boolean }) => enabled ? <AntdAffix {...props} children={children}/> : <Fragment>{children}</Fragment>;

import { ConfigConsumer, ConfigConsumerProps } from 'antd/es/config-provider';
import React, { Component } from 'react';
import classNames from 'classnames';
import RowContext from 'antd/es/grid/RowContext';
import { tuple } from 'utils/tuple';
import { getElementType } from 'utils/getElementType';

const log = require('debug')('components:Row');
// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
let enquire: any;
if ( typeof window !== 'undefined' ) {
    const matchMediaPolyfill = (mediaQuery: string) => {
        return {
            media  : mediaQuery,
            matches: false,
            addListener() {},
            removeListener() {},
        };
    };
    window.matchMedia        = window.matchMedia || matchMediaPolyfill as any;
    enquire                  = require('enquire.js');
}

export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type BreakpointMap = Partial<Record<Breakpoint, string>>;
const RowAligns  = tuple('top', 'middle', 'bottom');
const RowJustify = tuple('start', 'end', 'center', 'space-around', 'space-between');

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType
    gutter?: number | Partial<Record<Breakpoint, number>>;
    type?: 'flex';
    align?: (typeof RowAligns)[number];
    justify?: (typeof RowJustify)[number];
    prefixCls?: string;
}

export interface RowState {
    screens: BreakpointMap;
}

const responsiveArray: Breakpoint[] = [ 'xxl', 'xl', 'lg', 'md', 'sm', 'xs' ];

const responsiveMap: BreakpointMap = {
    xs : '(max-width: 575px)',
    sm : '(min-width: 576px)',
    md : '(min-width: 768px)',
    lg : '(min-width: 992px)',
    xl : '(min-width: 1200px)',
    xxl: '(min-width: 1600px)',
};


export class Row<P extends RowProps = RowProps> extends Component<P, RowState> {
    static defaultProps = {
        as    : 'div',
        gutter: 0,
    };

    // static propTypes = {
    //     as       : PropTypes.any,
    //     type     : PropTypes.oneOf<'flex'>([ 'flex' ]),
    //     align    : PropTypes.oneOf(RowAligns),
    //     justify  : PropTypes.oneOf(RowJustify),
    //     className: PropTypes.string,
    //     children : PropTypes.node,
    //     gutter   : PropTypes.oneOfType([ PropTypes.object, PropTypes.number ]),
    //     prefixCls: PropTypes.string,
    // };

    state: RowState = {
        screens: {},
    };

    componentDidMount() {
        Object.keys(responsiveMap).map((screen: Breakpoint) =>
            enquire.register(responsiveMap[ screen ], {
                match  : () => {
                    if ( typeof this.props.gutter !== 'object' ) {
                        return;
                    }
                    this.setState(prevState => ({
                        screens: {
                            ...prevState.screens,
                            [ screen ]: true,
                        },
                    }));
                },
                unmatch: () => {
                    if ( typeof this.props.gutter !== 'object' ) {
                        return;
                    }
                    this.setState(prevState => ({
                        screens: {
                            ...prevState.screens,
                            [ screen ]: false,
                        },
                    }));
                },
                // Keep a empty destory to avoid triggering unmatch when unregister
                destroy() {},
            }),
        );
    }

    componentWillUnmount() {
        Object.keys(responsiveMap).map((screen: Breakpoint) =>
            enquire.unregister(responsiveMap[ screen ]),
        );
    }

    getGutter(): number | undefined {
        const { gutter } = this.props;
        if ( typeof gutter === 'object' ) {
            for ( let i = 0; i < responsiveArray.length; i ++ ) {
                const breakpoint: Breakpoint = responsiveArray[ i ];
                if ( this.state.screens[ breakpoint ] && gutter[ breakpoint ] !== undefined ) {
                    return gutter[ breakpoint ];
                }
            }
        }
        return gutter as number;
    }

    renderRow = ({ getPrefixCls }: ConfigConsumerProps) => {
        const {
                  prefixCls: customizePrefixCls,
                  type,
                  justify,
                  align,
                  className,
                  style,
                  children,
                  as,
                  ...others
              }          = this.props;
        const prefixCls  = getPrefixCls('row', customizePrefixCls);
        const gutter     = this.getGutter();
        const classes    = classNames(
            {
                [ prefixCls ]                        : ! type,
                [ `${prefixCls}-${type}` ]           : type,
                [ `${prefixCls}-${type}-${justify}` ]: type && justify,
                [ `${prefixCls}-${type}-${align}` ]  : type && align,
            },
            className,
        );
        const rowStyle   =
                  (gutter as number) > 0
                  ? {
                          marginLeft : (gutter as number) / - 2,
                          marginRight: (gutter as number) / - 2,
                          ...style,
                      }
                  : style;
        const otherProps = { ...others } as any;
        delete otherProps.gutter;
        const ElementType = getElementType(this);
        return (
            <RowContext.Provider value={{ gutter }}>
                <ElementType {...otherProps} className={classes} style={rowStyle}>
                    {children}
                </ElementType>
            </RowContext.Provider>
        );
    };

    render() {
        return <ConfigConsumer>{this.renderRow}</ConfigConsumer>;
    }

    static wrap<T>(Comp: T, defaultProps: any = {}): T & Row {
        return class extends Component<any> {
            static defaultProps = {
                ...Row.defaultProps,
                ...(Comp || {} as any).defaultProps || {},
                ...defaultProps,
            };

            render() {
                log('wrap render', { Comp, props: this.props, self: this });
                const { as, ...props } = this.props;
                return <Row as={Comp as any} {...props}/>;
            }
        } as any;
    }
}

import React, { Component, CSSProperties } from 'react';
import { hot } from 'react-hot-loader';
import { animated, useSpring, UseSpringProps } from 'react-spring';
import { merge } from 'lodash';
import { Spin, SpinProps } from 'components/spin';
import { getElementType } from 'utils/getElementType';
import { classes } from 'typestyle';
import './loader.scss';
import loadable from '@loadable/component';

export interface LoaderLoadingProps {
    as?: React.ElementType
    className?: string
    style?: React.CSSProperties
    spin?: SpinProps | boolean
    loadingText?: React.ReactNode
    delay?: number
    prefixCls?: string
}

@hot(module)
export class LoaderLoading extends Component<LoaderLoadingProps> {
    static displayName                               = 'LoaderLoading';
    static defaultProps: Partial<LoaderLoadingProps> = {
        as         : 'span',
        spin       : false,
        delay      : 200,
        loadingText: 'Loading...',
        prefixCls  : 'c-loader-loading',
    };

    state = { show: false };

    mounted = false;

    public componentDidMount(): void {
        this.mounted = true;
        if ( this.props.delay && this.state.show === false ) {
            setTimeout(() => {
                if ( this.mounted ) {
                    this.setState({ show: true });
                }
            }, this.props.delay);
        } else if ( ! this.props.delay ) {
            this.setState({ show: true });
        }
    }

    public componentWillUnmount(): void {
        this.mounted = false;
    }

    render() {
        const { children, as, prefixCls, style, spin, loadingText, delay, className, ...props } = this.props;
        if ( this.state && this.state.show === false ) {
            return null;
        }

        const classNames  = classes(prefixCls, this.props.className);
        const ElementType = getElementType(LoaderLoading, this.props);
        return (
            <ElementType
                className={classNames}
                style={style}
                {...props}
            >
                <If condition={spin !== false}>
                    <Spin className={prefixCls + '-spin'} {...spin || { iconStyle: { fontSize: '5em' } }} />
                </If>
                <If condition={typeof loadingText === 'string'}>
                    <span className={prefixCls + '-text'}>{loadingText}</span>
                </If>
                <If condition={React.isValidElement(loadingText)}>
                    {loadingText}
                </If>
            </ElementType>
        );
    }
}

export type ILoadableComponent<T> = React.ComponentType<T> & { preload?(props?: T): void };
export type LoadableFunction = ((...args) => Promise<any>)
export type LoadableArray = Array<LoadableFunction> // | [ ((props?: any) => Promise<any>), ...Promise<any>[] ]
export type Loadable = LoadableFunction | LoadableArray

const isLoadableFunction = (val: any): val is LoadableFunction => typeof val === 'function';
const isLoadableArray    = (val: any): val is LoadableArray => Array.isArray(val) && isLoadableFunction(val[ 0 ]);
const isLoadable         = (val: any): val is Loadable => isLoadableFunction(val) || isLoadableArray(val);

export function isLoadableComponent<T>(val:any): val is ILoadableComponent<T> {
    return val && typeof val.preload === 'function'
}

export interface LoaderOptions {
    loadable: Loadable

    showLoading?: boolean
    loading?: React.ElementType
    loadingOptions?: LoaderLoadingProps

    animated?: boolean
    animation?: UseSpringProps<CSSProperties>
}

const getLoaderOptions = (options: LoaderOptions): LoaderOptions => {
    return merge({
        loading       : LoaderLoading,
        showLoading   : true,
        loadingOptions: {
            delay: 200,
        },
        animated      : false,
        animation     : {
            opacity: 1,
            from   : { opacity: 0 },
            config : { duration: 500 },
            // delay  : 2000,
        },
    }, options);
};

function resolve(loadable) {
    if ( React.isValidElement(loadable) || loadable instanceof React.Component.constructor ) {
        return loadable;
    }
    if ( React.isValidElement(loadable.default) || loadable.default instanceof React.Component.constructor ) {
        return loadable.default;
    }
    let k = Object.keys(loadable).find(k => React.isValidElement(loadable[ k ]) || loadable[ k ] instanceof React.Component.constructor);
    return loadable[ k ];
}

export function loader<T>(_options: LoaderOptions | Loadable): ILoadableComponent<T> {
    let options: LoaderOptions = getLoaderOptions(isLoadable(_options) ? { loadable: _options } : _options);

    const Loading  = options.loading;
    const fallback = options.showLoading ? <Loading {...options.loadingOptions}/> : undefined;

    let LazyComponent = loadable<T>(async (props) => {
        let loadable;
        if ( isLoadableArray(options.loadable) ) {
            let loadableValues = await Promise.all(options.loadable.map((l, i) => l(i === 0 ? props : undefined)));
            loadable           = loadableValues.shift();
        } else if ( isLoadableFunction(options.loadable) ) {
            loadable = await options.loadable(props);
        } else {
            throw new Error('invalid loadable');
        }
        LazyComponent.preload = (props) => loadable.preload(props)
        return {
            __esModule: true,
            default   : resolve(loadable),
        };
    }, { fallback });

    if ( ! options.animated ) {
        return LazyComponent;
    }

    let AnimatedLoadableComponent: ILoadableComponent<T>;
    AnimatedLoadableComponent             = function (props) {
        const style               = useSpring(options.animation);
        const displayName         = LazyComponent.displayName;
        LazyComponent             = animated(LazyComponent) as any;
        LazyComponent.displayName = displayName;
        return <LazyComponent {...props} style={style}/>;
    } as any;
    AnimatedLoadableComponent.displayName = 'AnimatedLoadableComponent';
    AnimatedLoadableComponent.preload     = (props) => LazyComponent.preload(props);
    return AnimatedLoadableComponent;
}

import _loadable from '@loadable/component';
import React, { Component, CSSProperties } from 'react';
import { hot } from 'react-hot-loader';
import { animated, useSpring, UseSpringProps } from 'react-spring';
import { merge } from 'lodash';
import { Spin, SpinProps } from 'components/spin';
import { getElementType } from 'utils/getElementType';
import { classes } from 'typestyle';
import './loader.scss';

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
                    <div className={prefixCls + '-text'}>{loadingText}</div>
                </If>
                <If condition={React.isValidElement(loadingText)}>
                    {loadingText}
                </If>
            </ElementType>
        );
    }
}

export type ILoadableComponent<T> = React.ComponentType<T> & { preload(props?: T): void };
export type LoadableFunction = ((props?: any) => Promise<any>)
export type LoadableArray = Array<LoadableFunction> // | [ ((props?: any) => Promise<any>), ...Promise<any>[] ]
export type Loadable = LoadableFunction | LoadableArray

const isLoadableFunction = (val: any): val is LoadableFunction => typeof val === 'function';
const isLoadableArray    = (val: any): val is LoadableArray => Array.isArray(val) && isLoadableFunction(val[ 0 ]);
const isLoadable         = (val: any): val is Loadable => isLoadableFunction(val) || isLoadableArray(val);

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
        showLoading   : false,
        loadingOptions: {},
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
    let Loadable;

    let LoadableComponent = _loadable(async (props) => {

        let loadable;
        if ( isLoadableArray(options.loadable) ) {
            let loadableValues = await Promise.all(options.loadable.map(l => l(props)));
            loadable           = loadableValues.shift();
        } else if ( isLoadableFunction(options.loadable) ) {
            loadable = await options.loadable(props);
        } else {
            throw new Error('invalid loadable');
        }
        Loadable = resolve(loadable);
        return Loadable;

    }, { fallback }) as ILoadableComponent<T>;

    // LoadableComponent.displayName = 'LoadableComponent';

    if ( ! options.animated ) {
        return LoadableComponent;
    }

    let AnimatedLoadableComponent: ILoadableComponent<T>;
    AnimatedLoadableComponent             = function (props) {
        const style                   = useSpring(options.animation);
        const displayName             = LoadableComponent.displayName;
        LoadableComponent             = animated(LoadableComponent) as any;
        LoadableComponent.displayName = displayName;
        return <LoadableComponent {...props} style={style}/>;
    } as any;
    AnimatedLoadableComponent.displayName = 'AnimatedLoadableComponent';
    AnimatedLoadableComponent.preload     = (props) => LoadableComponent.preload(props);
    return AnimatedLoadableComponent;
}

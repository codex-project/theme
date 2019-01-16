import React from 'react';
import { style } from 'typestyle';
import Loadable from 'react-loadable';
import { Popover } from 'antd';
import { Centered } from 'components/centered';
import { Loading } from 'components/loading';

export interface PopoverActionProps<T> {
    loader: () => Promise<T>
    render: (data: T) => React.ReactNode
}

export class PopoverAction<T> extends React.Component<PopoverActionProps<T>> {
    render() {
        function createPopoverLoader<T>(loader: () => Promise<T>, render: (data: T) => React.ReactNode) {
            const LoadingWrapper = (props) => (
                <div style={{ width: 200, height: 100 }}>
                    <Centered autoHeight={true}>
                        <Loading {...props} spin={{ size: 'large' }}/>
                    </Centered>
                </div>
            )
            return Loadable.Map({
                delay  : 0,
                loading: LoadingWrapper,
                loader : { data: loader },
                render : (loaded: { data: T }, props) => render(loaded.data)
            })
        }

        const Loader = createPopoverLoader<T>(this.props.loader, this.props.render);

        return (
            <Popover
                style={{ padding: 0 }}
                arrowPointAtCenter={true}
                placement="right"
                mouseEnterDelay={0.2}
                overlayClassName={style({ $nest: { '.ant-popover-inner-content': { padding: 0 } } })}
                content={<Loader/>}
            >{this.props.children}
            </Popover>
        )
    }
}

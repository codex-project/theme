import * as React from 'react';
//@ts-ignore TS2307
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import Hammer, { HammerDirection } from 'react-hammerjs';
import { Motion, spring } from 'react-motion';
import { isString } from 'lodash';
import { Icon ,Spin } from 'antd';

const log = require('debug')('off-canvas');

const Centered = (props) => <div {...props} />

export enum Direction { LEFT = 2, RIGHT = 4, UP = 8, DOWN = 16}

export namespace Direction {
    const makeComparer       = (left: Direction) => (right: Direction) => left.valueOf() === right.valueOf()
    export const is          = {
        LEFT : makeComparer(Direction.LEFT),
        RIGHT: makeComparer(Direction.RIGHT),
        UP   : makeComparer(Direction.UP),
        DOWN : makeComparer(Direction.DOWN)
    }
    export const toKey       = (dir: number): string => typeof dir === 'string' ? dir : Direction[ dir ]
    export const toValue     = (dir: string): number => typeof dir === 'number' ? dir : Direction[ dir ]
    export const toName      = (dir: number | string): HammerDirection => 'DIRECTION_' + (typeof dir === 'string' ? dir : Direction[ dir ]) as any
    export const getOpposite = (dir: Direction) => {
        if ( is.LEFT(dir) ) return Direction.RIGHT;
        if ( is.RIGHT(dir) ) return Direction.LEFT;
        if ( is.UP(dir) ) return Direction.DOWN;
        if ( is.DOWN(dir) ) return Direction.UP;
    }
}

export enum Position {TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom', LEFT = 'left'}

export namespace Position {
    const makeComparer        = (pos: Position) => (pos2: Position) => pos.valueOf() === pos2.valueOf()
    export const is           = {
        LEFT      : makeComparer(Position.LEFT),
        RIGHT     : makeComparer(Position.RIGHT),
        TOP       : makeComparer(Position.TOP),
        BOTTOM    : makeComparer(Position.BOTTOM),
        VERTICAL  : (pos) => is.LEFT(pos) || is.RIGHT(pos),
        HORIZONTAL: (pos) => is.TOP(pos) || is.BOTTOM(pos)
    }
    export const getDirection = (position: Position): Direction => {
        switch ( position ) {//@formatter:off
            case Position.TOP: return Direction.DOWN;
            case Position.RIGHT: return Direction.LEFT;
            case Position.BOTTOM: return Direction.UP;
            case Position.LEFT: return Direction.RIGHT;//@formatter:on
        }
    }
    export const getOpposite  = (pos: Position) => {
        if ( is.LEFT(pos) ) return Position.RIGHT;
        if ( is.RIGHT(pos) ) return Position.LEFT;
        if ( is.BOTTOM(pos) ) return Position.TOP;
        if ( is.TOP(pos) ) return Position.BOTTOM;
    }
    export const getStyle     = (position: Position) => ({
        left  : is.LEFT(position) || is.HORIZONTAL(position) ? 0 : undefined,
        right : is.RIGHT(position) || is.HORIZONTAL(position) ? 0 : undefined,
        top   : is.BOTTOM(position) ? undefined : 0,
        bottom: is.TOP(position) ? undefined : 0
    })
}

export type Pixels = number;
export type Size = Pixels | string;
export type Styles = Partial<Record<'container' | 'overlay' | 'drawer' | 'inner', React.CSSProperties>>;

export interface OffCanvasProps {
    position?: Position
    size?: Size
    handleSize?: Size
    margin?: Size
    prefix?: string
    open?: boolean
    overlay?: boolean
    enableDrag?: boolean
    styles?: Styles

    onPan?: (e: HammerInput) => void
    onChange?: (open: boolean) => void
}

interface OffCanvasState {}

@hot(module)
@observer
export class OffCanvas extends React.Component<OffCanvasProps, OffCanvasState> {
    static displayName: string                   = 'OffCanvas'
    static defaultProps: Partial<OffCanvasProps> = {
        margin    : 0,
        position  : Position.LEFT,
        size      : 300,
        handleSize: 50,
        prefix    : 'c-off-canvas',
        open      : false,
        onPan     : () => null,
        onChange  : () => null,
        overlay   : true,
        styles    : { drawer: {}, container: {}, overlay: {}, inner: {} },
        enableDrag: true
    }

    @observable size: Pixels            = 300;
    @observable margin: Size            = 300;
    @observable protected value: Pixels = 0;

    get isOpen(): boolean { return this.value >= this.size}

    @action updateSizes() {
        let size = parseInt(this.props.size as string);
        if ( isString(this.props.size) ) {
            size = this.props.size.endsWith('%') ? (document.body.clientWidth / 100) * parseInt(this.props.size) : parseInt(this.props.size)
        }
        if ( this.size !== size ) {
            this.size = size;
        }
    }

    public componentDidUpdate(prevProps: Readonly<OffCanvasProps>, prevState: Readonly<OffCanvasState>, snapshot?: any): void {
        this.updateSizes();
        if ( this.props.open !== prevProps.open ) {
            this.setValue(this.props.open ? this.size : 0);
        }
    }

    close() { this.setValue(0) }

    open() { this.setValue(this.size) }

    @action setValue = (value: number) => this.value = value;

    makeStyles(value: Pixels): Styles {
        const { position, handleSize, overlay } = this.props;
        let horizontal                          = Position.is.HORIZONTAL(position)
        if ( value > this.size ) value = this.size;
        if ( value < 0 ) value = 0;

        // noinspection UnnecessaryLocalVariableJS
        let styles: Styles = {
            container: {
                zIndex      : 1000,
                position    : 'fixed',
                ...Position.getStyle(position),
                [ position ]: (- this.size) + value,
                height      : horizontal ? this.size : '100%',
                width       : horizontal ? '100%' : this.size,
                boxShadow   : value > 0 ? '6px 0px 20px 0px rgba(0,0,0,0.5)' : undefined,
                ...this.props.styles.container || {}
            },
            inner    : {
                height         : '100%',
                width          : '100%',
                backgroundColor: 'white',
                // overflow       : 'hidden',
                // overflowY      : 'scroll',
                ...this.props.styles.inner || {}
            },
            overlay  : {
                zIndex         : 100,
                position       : 'fixed',
                top            : 0, right: 0, bottom: 0, left: 0,
                [ position ]   : value,
                backgroundColor: `rgba(0,0,0,${overlay ? '0.5' : '0'})`,
                ...this.props.styles.overlay || {}
            },
            drawer   : {
                zIndex                            : 10001,
                position                          : 'absolute',
                [ Position.getOpposite(position) ]: - handleSize,
                width                             : horizontal ? '100%' : handleSize,
                height                            : horizontal ? handleSize : '100%',
                ...this.props.styles.drawer || {}
            }
        }
        return styles;
    }

    render() {
        const { prefix, position } = this.props
        let direction              = Position.getDirection(position)
        return (
            <Motion
                defaultStyle={{ val: 0 }}
                style={{ val: spring(this.value) }}
                onRest={() => {
                    this.props.onChange(this.value >= this.size)
                }}
            >
                {(int) => {
                    let styles = this.makeStyles(int.val);

                    return (
                        <div
                            className={`${prefix}-container`}
                            style={styles.container}
                        >
                            <Hammer
                                direction={Position.is.VERTICAL(position) ? 'DIRECTION_VERTICAL' : 'DIRECTION_HORIZONTAL'}
                                className={`${prefix}-drawer`}
                                style={styles.drawer}
                                onPan={(event) => {
                                    if ( ! this.props.enableDrag ) {
                                        return;
                                    }
                                    if ( event.direction === direction ) {
                                        this.open()
                                    } else if ( event.direction === Direction.getOpposite(direction) ) {
                                        this.close()
                                    }
                                    log('onPan', { event, me: this, direction });
                                    this.props.onPan(event);
                                }}
                            >
                                <div/>
                            </Hammer>
                            {this.value > 0 ?
                             <Hammer
                                 className={`${prefix}-overlay`}
                                 style={styles.overlay}
                                 onTap={e => this.close()}
                             >
                                 <div/>
                             </Hammer> : null}
                            <div style={styles.inner}>
                                {this.props.children}
                                {/*{int.val >= this.size ? this.props.children : <Centered><Spin indicator={<Icon type="loading" style={{ fontSize: 44 }} spin/>}/></Centered>}*/}
                            </div>
                        </div>
                    );
                }}
            </Motion>
        );
    }
}

export default hot(module)(OffCanvas)

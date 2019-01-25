import * as React from 'react';

import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import Hammer, { HammerDirection } from 'react-hammerjs';
import { Motion, spring } from 'react-motion';
import { isString } from 'lodash';
import { hot } from 'decorators';

const log = require('debug')('off-canvas');

export enum Direction { LEFT = 2, RIGHT = 4, UP = 8, DOWN = 16}

const makeDirectionComparer = (left: Direction) => (right: Direction) => left.valueOf() === right.valueOf();

export class DirectionHelper {
    static is          = {
        LEFT : makeDirectionComparer(Direction.LEFT),
        RIGHT: makeDirectionComparer(Direction.RIGHT),
        UP   : makeDirectionComparer(Direction.UP),
        DOWN : makeDirectionComparer(Direction.DOWN),
    };
    static toKey       = (dir: number): string => typeof dir === 'string' ? dir : Direction[ dir ];
    static toValue     = (dir: string): number => typeof dir === 'number' ? dir : Direction[ dir ];
    static toName      = (dir: number | string): HammerDirection => 'DIRECTION_' + (typeof dir === 'string' ? dir : Direction[ dir ]) as any;
    static getOpposite = (dir: Direction) => {
        if ( DirectionHelper.is.LEFT(dir) ) return Direction.RIGHT;
        if ( DirectionHelper.is.RIGHT(dir) ) return Direction.LEFT;
        if ( DirectionHelper.is.UP(dir) ) return Direction.DOWN;
        if ( DirectionHelper.is.DOWN(dir) ) return Direction.UP;
    };
}

export enum Position {TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom', LEFT = 'left'}

const makePositionComparer = (pos: Position) => (pos2: Position) => pos.valueOf() === pos2.valueOf();

export class PositionHelper {
    static is           = {
        LEFT      : makePositionComparer(Position.LEFT),
        RIGHT     : makePositionComparer(Position.RIGHT),
        TOP       : makePositionComparer(Position.TOP),
        BOTTOM    : makePositionComparer(Position.BOTTOM),
        VERTICAL  : (pos) => PositionHelper.is.LEFT(pos) || PositionHelper.is.RIGHT(pos),
        HORIZONTAL: (pos) => PositionHelper.is.TOP(pos) || PositionHelper.is.BOTTOM(pos),
    };
    static getDirection = (position: Position): Direction => {
        switch ( position ) {//@formatter:off
            case Position.TOP: return Direction.DOWN;
            case Position.RIGHT: return Direction.LEFT;
            case Position.BOTTOM: return Direction.UP;
            case Position.LEFT: return Direction.RIGHT;//@formatter:on
        }
    }
    static getOpposite  = (pos: Position) => {
        if ( PositionHelper.is.LEFT(pos) ) return Position.RIGHT;
        if ( PositionHelper.is.RIGHT(pos) ) return Position.LEFT;
        if ( PositionHelper.is.BOTTOM(pos) ) return Position.TOP;
        if ( PositionHelper.is.TOP(pos) ) return Position.BOTTOM;
    };
    static getStyle     = (position: Position) => ({
        left  : PositionHelper.is.LEFT(position) || PositionHelper.is.HORIZONTAL(position) ? 0 : undefined,
        right : PositionHelper.is.RIGHT(position) || PositionHelper.is.HORIZONTAL(position) ? 0 : undefined,
        top   : PositionHelper.is.BOTTOM(position) ? undefined : 0,
        bottom: PositionHelper.is.TOP(position) ? undefined : 0,
    });
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
    static displayName: string                   = 'OffCanvas';
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
        enableDrag: true,
    };

    @observable size: Pixels            = 300;
    @observable margin: Size            = 300;
    @observable protected value: Pixels = 0;

    get isOpen(): boolean { return this.value >= this.size;}

    @action updateSizes() {
        let size = parseInt(this.props.size as string);
        if ( isString(this.props.size) ) {
            size = this.props.size.endsWith('%') ? (document.body.clientWidth / 100) * parseInt(this.props.size) : parseInt(this.props.size);
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

    close() { this.setValue(0); }

    open() { this.setValue(this.size); }

    toggle() { this.value >= this.size ? this.close() : this.open(); }

    @action setValue = (value: number) => this.value = value;

    makeStyles(value: Pixels): Styles {
        const { position, handleSize, overlay } = this.props;
        let horizontal                          = PositionHelper.is.HORIZONTAL(position);
        if ( value > this.size ) value = this.size;
        if ( value < 0 ) value = 0;

        // noinspection UnnecessaryLocalVariableJS
        let styles: Styles = {
            container: {
                zIndex      : 1000,
                position    : 'fixed',
                ...PositionHelper.getStyle(position),
                [ position ]: (- this.size) + value,
                height      : horizontal ? this.size : '100%',
                width       : horizontal ? '100%' : this.size,
                boxShadow   : value > 0 ? '6px 0px 20px 0px rgba(0,0,0,0.5)' : undefined,
                ...this.props.styles.container || {},
            },
            inner    : {
                height         : '100%',
                width          : '100%',
                backgroundColor: 'white',
                // overflow       : 'hidden',
                // overflowY      : 'scroll',
                ...this.props.styles.inner || {},
            },
            overlay  : {
                zIndex         : 100,
                position       : 'fixed',
                top            : 0, right: 0, bottom: 0, left: 0,
                [ position ]   : value,
                backgroundColor: `rgba(0,0,0,${overlay ? '0.5' : '0'})`,
                ...this.props.styles.overlay || {},
            },
            drawer   : {
                zIndex                                  : 10001,
                position                                : 'absolute',
                [ PositionHelper.getOpposite(position) ]: - handleSize,
                width                                   : horizontal ? '100%' : handleSize,
                height                                  : horizontal ? handleSize : '100%',
                ...this.props.styles.drawer || {},
            },
        };
        return styles;
    }

    render() {
        const { prefix, position } = this.props;
        let direction              = PositionHelper.getDirection(position);
        return (
            <Motion
                defaultStyle={{ val: 0 }}
                style={{ val: spring(this.value) }}
                onRest={() => {
                    this.props.onChange(this.value >= this.size);
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
                                direction={PositionHelper.is.VERTICAL(position) ? 'DIRECTION_VERTICAL' : 'DIRECTION_HORIZONTAL'}
                                className={`${prefix}-drawer`}
                                style={styles.drawer}
                                onPan={(event) => {
                                    if ( ! this.props.enableDrag ) {
                                        return;
                                    }
                                    if ( event.direction === direction ) {
                                        this.open();
                                    } else if ( event.direction === DirectionHelper.getOpposite(direction) ) {
                                        this.close();
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

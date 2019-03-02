import { HammerDirection } from 'react-hammerjs';

export enum Direction { LEFT = 2, RIGHT = 4, UP = 8, DOWN = 16}

export type IDirection = 2 | 4 | 8 | 16

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

export type IPosition = 'top' | 'right' | 'bottom' | 'left'

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

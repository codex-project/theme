import { tuple } from './tuple';
import { deg, em, percent, px, rad, rem, turn, viewHeight, viewWidth } from 'csx';


export const cssNumberTransforms = tuple('percent', 'deg', 'em', 'px', 'rad', 'rem', 'vh', 'vw', 'turn');
export type CSSNumberTransform = (typeof cssNumberTransforms)[number]

export class CSSNumber extends Number {
    constructor(value: any) {
        super(parseInt(value));
    }

    /**
     * Returns the number with a suffix of %
     */
    toPercent    = (): string => percent(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of deg
     */
    toDeg        = (): string => deg(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of em
     */
    toEm         = (): string => em(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of px
     */
    toPx         = (): string => px(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of rad
     */
    toRad        = (): string => rad(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of rem
     */
    toRem        = (): string => rem(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of vh
     */
    toViewHeight = (): string => viewHeight(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of vw
     */
    toViewWidth  = (): string => viewWidth(this.valueOf()) as any;
    /**
     * Returns the number with a suffix of turn
     */
    toTurn       = (): string => turn(this.valueOf()) as any;
}

















































































































































































































































































import { deg, em, percent, px, rad, rem, turn, viewHeight, viewWidth } from 'csx';
import { camelCase } from 'lodash';

const unitTransforms = { deg, em, percent, px, rad, rem, turn, viewHeight, viewWidth };
const units          = Object.keys(unitTransforms);
units.forEach(unit => {
    let fnName = camelCase('to_' + unit);
    Number.prototype[ fnName] = function () {
        return unitTransforms[ unit ](this.valueOf());
    };
});
declare global {
    interface Number {
        /**
         * Returns the number with a suffix of %
         */
        toPercent: () => string
        /**
         * Returns the number with a suffix of deg
         */
        toDeg: () => string
        /**
         * Returns the number with a suffix of em
         */
        toEm: () => string
        /**
         * Returns the number with a suffix of px
         */
        toPx: () => string
        /**
         * Returns the number with a suffix of rad
         */
        toRad: () => string
        /**
         * Returns the number with a suffix of rem
         */
        toRem: () => string
        /**
         * Returns the number with a suffix of vh
         */
        toViewHeight: () => string
        /**
         * Returns the number with a suffix of vw
         */
        toViewWidth: () => string
        /**
         * Returns the number with a suffix of turn
         */
        toTurn: () => string
    }
}

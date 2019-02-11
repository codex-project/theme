/**
 * @see https://raw.githubusercontent.com/quasarframework/quasar/dev/src/utils/scroll.js
 * @copyright Quasar Framework
 */
import { strEnsureLeft, strStripLeft } from './general';
import { debounce } from 'lodash-decorators';
import { keyBy, map, mapValues, reverse, sortBy } from 'lodash';
import { defer } from './promise';

export function getScrollTarget<T extends Element | Window>(el: Element | Node, selector?: string): T | Element | Window {
    return (el as Element).closest(selector || '.c-scrollbar') || window;
}

export function getScrollHeight(el): number {
    return (el === window ? document.body : el).scrollHeight;
}

export function getScrollPosition(scrollTarget): number {
    if ( scrollTarget === window ) {
        return window.pageYOffset || window.scrollY || document.body.scrollTop || 0;
    }
    return scrollTarget.scrollTop;
}

export function animScrollTo(el, to, duration) {
    if ( duration <= 0 ) {
        return;
    }

    const pos = getScrollPosition(el);

    window.requestAnimationFrame(() => {
        setScroll(el, pos + (to - pos) / duration * 16);
        if ( el.scrollTop !== to ) {
            animScrollTo(el, to, duration - 16);
        }
    });
}

export function animScrollToFn(getScrollPosition: () => number, setScrollPosition: (pos: number) => any, offset:number, duration:number=1000) {
    if ( duration <= 0 ) {
        return;
    }

    let pos = getScrollPosition();

    window.requestAnimationFrame(() => {
        setScrollPosition(pos + (offset - pos) / duration * 16);
        pos = getScrollPosition();
        if ( pos !== offset ) {
            animScrollToFn(getScrollPosition, setScrollPosition, offset, duration - 16);
        }
    });
}

function setScroll(scrollTarget, offset) {
    if ( scrollTarget === window ) {
        document.documentElement.scrollTop = offset;
        document.body.scrollTop            = offset;
        return;
    }
    scrollTarget.scrollTop = offset;
}

export function setScrollPosition(scrollTarget, offset, duration) {
    if ( duration ) {
        animScrollTo(scrollTarget, offset, duration);
        return;
    }
    setScroll(scrollTarget, offset);
}


export function hasScrollbar(el) {
    if ( ! el || el.nodeType !== Node.ELEMENT_NODE ) {
        return false;
    }

    return (
        el.classList.contains('scroll') ||
        [ 'auto', 'scroll' ].includes(window.getComputedStyle(el)[ 'overflow-y' ])
    ) && el.scrollHeight > el.clientHeight;
}

export type ItemID = string
export type TargetID = string
export type ID = ItemID | TargetID
export type Items2Targets = Record<ItemID, TargetID>;
export type Targets2Items = Record<TargetID, ItemID>;
export type ZeptoMap<T extends ID = ID> = Record<T, ZeptoCollection>
export type TargetPositions = Record<TargetID, ZeptoCollection>
export type OnChangeCallback = (targetID: TargetID, itemID: ItemID) => void

const log = require('debug')('utils:scroll');


const sortByValues = (object, _reverse = false) => {
    object = map(object, (val, key) => ({ name: key, count: val }));
    object = sortBy(object, 'count');
    if ( _reverse ) object = reverse(object);
    object = keyBy(object, 'name');
    object = mapValues(object, 'count');
    return object;
};

export class ScrollSpyHelper {
    protected targets: ZeptoMap<TargetID>              = {};
    protected items: ZeptoMap<ItemID>                  = {};
    protected scrollListener: (event: UIEvent) => void = null;
    protected targetItems: Targets2Items               = {};

    constructor(protected itemTargets: Items2Targets, protected offset: number = 0, protected el: Element | Window = window) {
        this.itemIds.forEach(itemID => {
            itemID                       = strStripLeft(itemID, '#');
            let targetID                 = itemTargets[ itemID ];
            this.targetItems[ targetID ] = itemID;
            this.items[ itemID ]         = $(strEnsureLeft(itemID, '#'));
        });
        this.targetIds.forEach(targetID => {
            targetID                 = strStripLeft(targetID, '#');
            this.targets[ targetID ] = $(strEnsureLeft(targetID, '#'));
        });
    }

    get itemIds(): string[] { return Object.keys(this.itemTargets); }

    get targetIds(): string[] { return this.itemIds.map(listItemId => this.itemTargets[ listItemId ]); }

    getScrollPosition(): number {return getScrollPosition(this.el); }

    getTargetPosition(targetID: TargetID): number { return this.getTarget(targetID).offset().top; }

    getItem(itemID: ItemID): ZeptoCollection {return this.items[ strStripLeft(itemID, '#') ];}

    getTarget(targetID: TargetID): ZeptoCollection {return this.targets[ strStripLeft(targetID, '#') ];}

    item2targetID(itemID: ItemID): TargetID {return this.itemTargets[ strStripLeft(itemID, '#') ];}

    target2itemID(targetID: TargetID): ItemID {return this.targetItems[ strStripLeft(targetID, '#') ];}

    getItemTarget(itemID: ItemID): ZeptoCollection {return this.targets[ this.item2targetID(itemID) ]; }

    getTargetItem(targetID: TargetID): ZeptoCollection { return this.items[ this.target2itemID(targetID) ]; }

    @debounce(100, { leading: true, trailing: true })
    getTargetPositions(): Record<TargetID, number> {
        let positions = {};
        this.targetIds.forEach(targetID => {
            positions[ targetID ] = this.getTargetPosition(targetID);
        });
        return positions;
    }

    hasPassedTarget(targetID: TargetID, offset: number = 0) {
        let position       = this.getScrollPosition();
        let targetPosition = this.getTargetPosition(targetID);
        return (position + offset) > targetPosition;
    }

    getSortedTargetPositions(direction: 'asc' | 'desc' = 'asc') { return sortByValues(this.getTargetPositions(), direction === 'desc'); }

    getHighestPassedPositionTargetID(): TargetID | null {
        let position        = this.getScrollPosition();
        let sortedPositions = this.getSortedTargetPositions();
        let highestTargetID = null;
        for ( const targetID in sortedPositions ) {
            const targetPosition = sortedPositions[ targetID ];
            if ( (position + this.offset) > targetPosition ) {
                highestTargetID = targetID;
                continue;
            }
            break;
        }
        return highestTargetID;
    }

    start(startupDelay: number = 1000) {
        if ( ! this.scrollListener ) {
            let highestTargetID = null;
            this.scrollListener = event => {
                let pos                    = this.getScrollPosition();
                let currentHighestTargetID = this.getHighestPassedPositionTargetID();
                if ( highestTargetID !== currentHighestTargetID ) {
                    highestTargetID = currentHighestTargetID;
                    this.onChangeCallback(highestTargetID, highestTargetID ? this.target2itemID(highestTargetID) : null);
                }
            };
        }

        setTimeout(() => {
            this.el.addEventListener('scroll', this.scrollListener);
        }, startupDelay);
    }

    stop() {
        if ( this.scrollListener ) {
            this.el.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
    }

    protected onChangeCallback: OnChangeCallback = () => null;

    onChange(cb: OnChangeCallback) {
        this.onChangeCallback = cb;
    }
}


export function scrollTo(scrollTo: string | number | HTMLElement, scrollOffset: number = 0, scrollDuration: number = 1000): Promise<any> {
    let def = defer();
    // polyfill
    if ( 'performance' in window == false ) {
        (window as any)[ 'performance' ] = {};
    }

    if ( 'now' in window.performance == false ) {
        Date.now = (Date.now || function () {  // thanks IE8
            return new Date().getTime();
        });


        let nowOffset = Date.now();

        if ( performance.timing && performance.timing.navigationStart ) {
            nowOffset = performance.timing.navigationStart;
        }

        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };
    }
    //
    // Set a default for where we're scrolling to
    //

    if ( typeof scrollTo === 'string' ) {

        // Assuming this is a selector we can use to find an element
        let scrollToObj = $(scrollTo as string).get(0);

        if ( scrollToObj && typeof scrollToObj.getBoundingClientRect === 'function' ) {
            scrollTo = window.pageYOffset + scrollToObj.getBoundingClientRect().top;
        } else {
            throw 'error: No element found with the selector "' + scrollTo + '"';
        }
    } else if ( typeof scrollTo !== 'number' ) {

        // If it's nothing above and not an integer, we assume top of the window
        scrollTo = 0;
    } else {
        let scrollToObj = $(scrollTo as any).get(0);
        if ( scrollToObj && typeof scrollToObj.getBoundingClientRect === 'function' ) {
            scrollTo = window.pageYOffset + scrollToObj.getBoundingClientRect().top;
        } else {
            throw 'error: No element found with the selector "' + scrollTo + '"';
        }
    }

    scrollTo += scrollOffset;
    // Set this a bit higher

    const anchorHeightAdjust = 30;
    if ( scrollTo > anchorHeightAdjust ) {
        scrollTo = scrollTo - anchorHeightAdjust;
    }

    // Declarations

    const cosParameter = (window.pageYOffset - scrollTo) / 2;
    let scrollCount    = 0,
        oldTimestamp   = window.performance.now();

    function step(newTimestamp) {

        let tsDiff = newTimestamp - oldTimestamp;

        // Performance.now() polyfill loads late so passed-in timestamp is a larger offset
        // on the first go-through than we want so I'm adjusting the difference down here.
        // Regardless, we would rather have a slightly slower animation than a big jump so a good
        // safeguard, even if we're not using the polyfill.

        if ( tsDiff > 100 ) {
            tsDiff = 30;
        }

        scrollCount += Math.PI / (scrollDuration / tsDiff);

        // As soon as we cross over Pi, we're about where we need to be

        if ( scrollCount >= Math.PI ) {
            return def.resolve();
        }

        const moveStep = Math.round((scrollTo as number) + cosParameter + cosParameter * Math.cos(scrollCount));
        window.scrollTo(0, moveStep);
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
    return def.promise;
}

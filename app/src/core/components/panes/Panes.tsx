import React, { cloneElement, Component } from 'react';

import { CSS } from 'utils/styled';

import Resizer from './Resizer';
import Pane from './Pane';
import { hot } from 'react-hot-loader';
import { convert, convertToUnit, getUnit, removeNullChildren } from 'components/panes/utils';
import { getElementType } from 'utils/getElementType';
import { classes, style } from 'typestyle';

const DEFAULT_PANE_SIZE     = '1';
const DEFAULT_PANE_MIN_SIZE = '0';
const DEFAULT_PANE_MAX_SIZE = '100%';

const columnStyle: CSS = {
    display      : 'flex',
    height       : '100%',
    flexDirection: 'column',
    flex         : 1,
    outline      : 'none',
    overflow     : 'hidden',
    userSelect   : 'text',
};

const rowStyle: CSS = {
    display      : 'flex',
    height       : '100%',
    flexDirection: 'row',
    flex         : 1,
    outline      : 'none',
    overflow     : 'hidden',
    userSelect   : 'text',
};


export interface PanesProps {
    as?: React.ReactType
    className?: string
    style?: React.CSSProperties
    split?: 'vertical' | 'horizontal'
    resizerSize?: number
    resizerClassName?: string
    resizerStyle?: React.CSSProperties
    onChange?: Function
    onResizeStart?: Function
    onResizeEnd?: Function
    allowResize?: boolean
    isPane?: (child: React.ReactComponentElement<typeof Pane>) => boolean
    Pane?: any
}

export class Panes<P extends PanesProps = PanesProps> extends Component<P> {
    static displayName?: string               = 'Panes';
    static defaultProps?: Partial<PanesProps> = {
        as         : 'div',
        split      : 'vertical',
        resizerSize: 1,
        allowResize: true,
        Pane       : Pane,
        isPane     : (child: React.ReactComponentElement<typeof Pane>) => {
            return child.type.displayName === 'HotExportedDragPane' || child.type.displayName === 'DragPane' || child.type.displayName === 'HotExportedPane' || child.type.displayName === 'Pane';
        },
    };
    state                                     = { sizes: this.getPanePropSize(this.props) };
    resizerIndex: number;
    dimensionsSnapshot: any;
    startClientX: number;
    startClientY: number;
    splitPane: any;
    paneElements: any;

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ sizes: this.getPanePropSize(nextProps) });
    }

    componentWillUnmount() {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);

        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onMouseUp);
    }

    onMouseDown = (event, resizerIndex) => {
        if ( event.button !== 0 ) {
            return;
        }

        event.preventDefault();

        this.onDown(resizerIndex, event.clientX, event.clientY);
    };

    onTouchStart = (event, resizerIndex) => {
        event.preventDefault();

        const { clientX, clientY } = event.touches[ 0 ];

        this.onDown(resizerIndex, clientX, clientY);
    };

    onDown = (resizerIndex, clientX, clientY) => {
        const { allowResize, onResizeStart, split } = this.props;

        if ( ! allowResize ) {
            return;
        }

        this.resizerIndex       = resizerIndex;
        this.dimensionsSnapshot = this.getDimensionsSnapshot(this.props);
        this.startClientX       = clientX;
        this.startClientY       = clientY;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onMouseUp);
        document.addEventListener('touchcancel', this.onMouseUp);

        if ( onResizeStart ) {
            onResizeStart();
        }
    };

    onMouseMove = (event) => {
        event.preventDefault();

        this.onMove(event.clientX, event.clientY);
    };

    onTouchMove = (event) => {
        event.preventDefault();

        const { clientX, clientY } = event.touches[ 0 ];

        this.onMove(clientX, clientY);
    };

    onMouseUp = (event) => {
        event.preventDefault();

        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);

        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onMouseUp);
        document.addEventListener('touchcancel', this.onMouseUp);

        if ( this.props.onResizeEnd ) {
            this.props.onResizeEnd(this.state.sizes);
        }
    };

    getDimensionsSnapshot(props) {
        const split               = props.split;
        const paneDimensions      = this.getPaneDimensions();
        const splitPaneDimensions = this.splitPane.getBoundingClientRect();
        const minSizes            = this.getPanePropMinMaxSize(props, 'minSize');
        const maxSizes            = this.getPanePropMinMaxSize(props, 'maxSize');

        const resizersSize    = this.getResizersSize(removeNullChildren(this.props.children));
        const splitPaneSizePx = split === 'vertical'
                                ? splitPaneDimensions.width - resizersSize
                                : splitPaneDimensions.height - resizersSize;

        const minSizesPx = minSizes.map(s => convert(s, splitPaneSizePx));
        const maxSizesPx = maxSizes.map(s => convert(s, splitPaneSizePx));
        const sizesPx    = paneDimensions.map(d => split === 'vertical' ? d.width : d.height);

        return {
            resizersSize,
            paneDimensions,
            splitPaneSizePx,
            minSizesPx,
            maxSizesPx,
            sizesPx,
        };
    }

    getPanePropSize(props) {
        return removeNullChildren(props.children).map(child => {
            const value = child.props[ 'size' ] || child.props[ 'initialSize' ];
            if ( value === undefined ) {
                return DEFAULT_PANE_SIZE;
            }

            return String(value);
        });
    }

    getPanePropMinMaxSize(props, key) {
        return removeNullChildren(props.children).map(child => {
            const value = child.props[ key ];
            if ( value === undefined ) {
                return key === 'maxSize' ? DEFAULT_PANE_MAX_SIZE : DEFAULT_PANE_MIN_SIZE;
            }

            return value;
        });
    }

    getPaneDimensions() {
        return this.paneElements.filter(el => el).map(el => el.getBoundingClientRect());
    }

    getSizes() {
        return this.state.sizes;
    }

    onMove(clientX, clientY) {
        const { split, onChange } = this.props;
        const resizerIndex        = this.resizerIndex;
        const {
                  sizesPx,
                  minSizesPx,
                  maxSizesPx,
                  splitPaneSizePx,
                  paneDimensions,
              }                   = this.dimensionsSnapshot;

        const sizeDim   = split === 'vertical' ? 'width' : 'height';
        const primary   = paneDimensions[ resizerIndex ];
        const secondary = paneDimensions[ resizerIndex + 1 ];
        const maxSize   = primary[ sizeDim ] + secondary[ sizeDim ];

        const primaryMinSizePx   = minSizesPx[ resizerIndex ];
        const secondaryMinSizePx = minSizesPx[ resizerIndex + 1 ];
        const primaryMaxSizePx   = Math.min(maxSizesPx[ resizerIndex ], maxSize);
        const secondaryMaxSizePx = Math.min(maxSizesPx[ resizerIndex + 1 ], maxSize);

        const moveOffset = split === 'vertical'
                           ? this.startClientX - clientX
                           : this.startClientY - clientY;

        let primarySizePx   = primary[ sizeDim ] - moveOffset;
        let secondarySizePx = secondary[ sizeDim ] + moveOffset;

        let primaryHasReachedLimit   = false;
        let secondaryHasReachedLimit = false;

        if ( primarySizePx < primaryMinSizePx ) {
            primarySizePx          = primaryMinSizePx;
            primaryHasReachedLimit = true;
        } else if ( primarySizePx > primaryMaxSizePx ) {
            primarySizePx          = primaryMaxSizePx;
            primaryHasReachedLimit = true;
        }

        if ( secondarySizePx < secondaryMinSizePx ) {
            secondarySizePx          = secondaryMinSizePx;
            secondaryHasReachedLimit = true;
        } else if ( secondarySizePx > secondaryMaxSizePx ) {
            secondarySizePx          = secondaryMaxSizePx;
            secondaryHasReachedLimit = true;
        }

        if ( primaryHasReachedLimit ) {
            secondarySizePx = primary[ sizeDim ] + secondary[ sizeDim ] - primarySizePx;
        } else if ( secondaryHasReachedLimit ) {
            primarySizePx = primary[ sizeDim ] + primary[ sizeDim ] - secondarySizePx;
        }

        sizesPx[ resizerIndex ]     = primarySizePx;
        sizesPx[ resizerIndex + 1 ] = secondarySizePx;

        let sizes = this.getSizes().concat();
        let updateRatio;

        [ primarySizePx, secondarySizePx ].forEach((paneSize, idx) => {
            const unit = getUnit(sizes[ resizerIndex + idx ]);
            if ( unit !== 'ratio' ) {
                sizes[ resizerIndex + idx ] = convertToUnit(paneSize, unit, splitPaneSizePx);
            } else {
                updateRatio = true;
            }
        });

        if ( updateRatio ) {
            let ratioCount = 0;
            let lastRatioIdx;
            sizes          = sizes.map((size, idx) => {
                if ( getUnit(size) === 'ratio' ) {
                    ratioCount ++;
                    lastRatioIdx = idx;

                    return convertToUnit(sizesPx[ idx ], 'ratio');
                }

                return size;
            });

            if ( ratioCount === 1 ) {
                sizes[ lastRatioIdx ] = '1';
            }
        }

        onChange && onChange(sizes);

        this.setState({
            sizes,
        });
    }

    setPaneRef = (el, idx) => {
        if ( ! this.paneElements ) {
            this.paneElements = [];
        }

        this.paneElements[ idx ] = el;
    };

    getResizersSize(children) {
        return (children.length - 1) * this.props.resizerSize;
    }

    getElements(panes: Panes, children: any[]) {
        const { className, style, split, resizerClassName, resizerStyle, isPane, Pane } = panes.props;
        const sizes                                                                     = panes.getSizes();
        const resizersSize                                                              = panes.getResizersSize(children);
        return children.reduce((acc, child, idx) => {
            let pane;
            const resizerIndex = idx - 1;
            const paneProps    = {
                index      : idx,
                'data-type': 'Pane',
                split      : split,
                key        : `Pane-${idx}`,
                innerRef   : panes.setPaneRef,
                resizersSize,
                size       : sizes[ idx ],
            };

            if ( isPane(child) ) {
                pane = cloneElement(child, paneProps);
            } else {
                pane = <Pane {...paneProps}>{child}</Pane>;
            }

            if ( acc.length === 0 ) {
                return [ ...acc, pane ];
            } else {
                const resizer = (
                    <Resizer
                        index={resizerIndex}
                        key={`Resizer-${resizerIndex}`}
                        split={split}
                        onMouseDown={this.onMouseDown}
                        onTouchStart={this.onTouchStart}
                        className={resizerClassName}
                        style={resizerStyle}
                    />
                );

                return [ ...acc, resizer, pane ];
            }
        }, []);
    }

    render() {
        const { children, className, split } = this.props;
        const notNullChildren                = removeNullChildren(children);
        const elements                       = this.getElements(this, notNullChildren);
        const computedClass                  = style(split === 'vertical' ? rowStyle : columnStyle);
        const ElementType                    = getElementType(Panes, this.props);


        return (
            <ElementType
                className={classes(computedClass, className)}
                style={this.props.style}
                data-type='SplitPane'
                data-split={split}
                ref={el => {
                    this.splitPane = el;
                }}
            >
                {elements}
            </ElementType>
        );
    }
}

export default hot(module)(Panes);

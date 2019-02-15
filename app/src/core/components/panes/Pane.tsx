import React, { PureComponent } from 'react';

import { convertSizeToCssValue, getUnit } from './utils';
import { hot } from 'react-hot-loader';
import { getElementType } from 'utils/getElementType';

function PaneStyle({ split, initialSize, size, minSize, maxSize, resizersSize }: any) {
    const value     = size || initialSize;
    const vertical  = split === 'vertical';
    const styleProp = {
        minSize: vertical ? 'minWidth' : 'minHeight',
        maxSize: vertical ? 'maxWidth' : 'maxHeight',
        size   : vertical ? 'width' : 'height',
    };

    let style: any = {
        display: 'flex',
        outline: 'none',
    };

    style[ styleProp.minSize ] = convertSizeToCssValue(minSize, resizersSize);
    style[ styleProp.maxSize ] = convertSizeToCssValue(maxSize, resizersSize);

    switch ( getUnit(value) ) {
        case 'ratio':
            style.flex = value;
            break;
        case '%':
        case 'px':
            style.flexGrow          = 0;
            style[ styleProp.size ] = convertSizeToCssValue(value, resizersSize);
            break;
    }

    return style;
}

export interface PaneProps {
    as?: React.ReactType
    className?: string
    style?: React.CSSProperties
    innerRef?: (element, index) => any
    index?: number
    initialSize?: string | number
    minSize?: string
    maxSize?: string
}


export class Pane<P extends PaneProps = PaneProps> extends PureComponent<P> {
    static displayName?: string              = 'Pane';
    static defaultProps?: Partial<PaneProps> = {
        as         : 'div',
        initialSize: '1',
        split      : 'vertical',
        minSize    : '20',
        maxSize    : '100%',
        innerRef   : () => null,
    };

    render() {
        const { children, className, style } = this.props;
        const prefixedStyle                  = PaneStyle(this.props);
        const ElementType                    = getElementType(Pane, this.props);

        return (
            <ElementType
                className={className}
                style={{
                    ...style,
                    ...prefixedStyle,
                }}
                ref={ref => this.props.innerRef(ref, this.props.index)}
            >
                {children}
            </ElementType>
        );
    }
}

export default hot(module)(Pane);

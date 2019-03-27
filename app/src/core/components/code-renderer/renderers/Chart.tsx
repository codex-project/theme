import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import ChartComponent, { Bar, Bubble, ChartComponentProps, Doughnut, HorizontalBar, Line, Pie, Polar, Radar, Scatter } from 'react-chartjs-2';

export interface ChartProps {
    chart: ChartComponentProps
}


@hot(module)
@observer
export class Chart extends Component<ChartProps> {
    static displayName                       = 'Chart';
    static defaultProps: Partial<ChartProps> = {};
    types                                    = {
        doughnut     : Doughnut,
        pie          : Pie,
        line         : Line,
        scatter      : Scatter,
        bar          : Bar,
        horizontalbar: HorizontalBar,
        radar        : Radar,
        polar        : Polar,
        bubble       : Bubble,
    };

    render() {
        const { children, chart, ...props } = this.props;
        const { type, options, data }       = chart;
        if ( ! Object.keys(this.types).includes(type) ) return 'Invalid type';
        const ElementType = this.types[ type ] as typeof ChartComponent;

        return (
            <ElementType
                data={data}
                options={options}
            />
        );
    }

}


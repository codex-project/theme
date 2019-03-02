import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import * as nomnoml from 'nomnoml';


console.log('nomnoml', nomnoml);

export interface NomnomlProps {
    code: string
}


@hot(module)
@observer
export default class Nomnoml extends Component<NomnomlProps> {
    static displayName                         = 'Nomnoml';
    static defaultProps: Partial<NomnomlProps> = {};

    canvasRef = React.createRef<HTMLCanvasElement>();

    public componentDidMount(): void {
        this.draw(this.props.code);
    }

    render() {
        const { children, ...props } = this.props;
        return (
            <canvas ref={this.canvasRef}/>
        );
    }

    draw(code: string) {
        nomnoml.draw(this.canvasRef.current, code);
    }
}


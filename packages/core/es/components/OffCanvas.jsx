var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as React from 'react';
//@ts-ignore TS2307
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import Hammer from 'react-hammerjs';
import { Motion, spring } from 'react-motion';
import { isString } from 'lodash';
const log = require('debug')('off-canvas');
const Centered = (props) => <div {...props}/>;
export var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 4] = "RIGHT";
    Direction[Direction["UP"] = 8] = "UP";
    Direction[Direction["DOWN"] = 16] = "DOWN";
})(Direction || (Direction = {}));
(function (Direction) {
    const makeComparer = (left) => (right) => left.valueOf() === right.valueOf();
    Direction.is = {
        LEFT: makeComparer(Direction.LEFT),
        RIGHT: makeComparer(Direction.RIGHT),
        UP: makeComparer(Direction.UP),
        DOWN: makeComparer(Direction.DOWN)
    };
    Direction.toKey = (dir) => typeof dir === 'string' ? dir : Direction[dir];
    Direction.toValue = (dir) => typeof dir === 'number' ? dir : Direction[dir];
    Direction.toName = (dir) => 'DIRECTION_' + (typeof dir === 'string' ? dir : Direction[dir]);
    Direction.getOpposite = (dir) => {
        if (Direction.is.LEFT(dir))
            return Direction.RIGHT;
        if (Direction.is.RIGHT(dir))
            return Direction.LEFT;
        if (Direction.is.UP(dir))
            return Direction.DOWN;
        if (Direction.is.DOWN(dir))
            return Direction.UP;
    };
})(Direction || (Direction = {}));
export var Position;
(function (Position) {
    Position["TOP"] = "top";
    Position["RIGHT"] = "right";
    Position["BOTTOM"] = "bottom";
    Position["LEFT"] = "left";
})(Position || (Position = {}));
(function (Position) {
    const makeComparer = (pos) => (pos2) => pos.valueOf() === pos2.valueOf();
    Position.is = {
        LEFT: makeComparer(Position.LEFT),
        RIGHT: makeComparer(Position.RIGHT),
        TOP: makeComparer(Position.TOP),
        BOTTOM: makeComparer(Position.BOTTOM),
        VERTICAL: (pos) => Position.is.LEFT(pos) || Position.is.RIGHT(pos),
        HORIZONTAL: (pos) => Position.is.TOP(pos) || Position.is.BOTTOM(pos)
    };
    Position.getDirection = (position) => {
        switch (position) { //@formatter:off
            case Position.TOP: return Direction.DOWN;
            case Position.RIGHT: return Direction.LEFT;
            case Position.BOTTOM: return Direction.UP;
            case Position.LEFT: return Direction.RIGHT; //@formatter:on
        }
    };
    Position.getOpposite = (pos) => {
        if (Position.is.LEFT(pos))
            return Position.RIGHT;
        if (Position.is.RIGHT(pos))
            return Position.LEFT;
        if (Position.is.BOTTOM(pos))
            return Position.TOP;
        if (Position.is.TOP(pos))
            return Position.BOTTOM;
    };
    Position.getStyle = (position) => ({
        left: Position.is.LEFT(position) || Position.is.HORIZONTAL(position) ? 0 : undefined,
        right: Position.is.RIGHT(position) || Position.is.HORIZONTAL(position) ? 0 : undefined,
        top: Position.is.BOTTOM(position) ? undefined : 0,
        bottom: Position.is.TOP(position) ? undefined : 0
    });
})(Position || (Position = {}));
let OffCanvas = class OffCanvas extends React.Component {
    constructor() {
        super(...arguments);
        this.size = 300;
        this.margin = 300;
        this.value = 0;
        this.setValue = (value) => this.value = value;
    }
    get isOpen() { return this.value >= this.size; }
    updateSizes() {
        let size = parseInt(this.props.size);
        if (isString(this.props.size)) {
            size = this.props.size.endsWith('%') ? (document.body.clientWidth / 100) * parseInt(this.props.size) : parseInt(this.props.size);
        }
        if (this.size !== size) {
            this.size = size;
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateSizes();
        if (this.props.open !== prevProps.open) {
            this.setValue(this.props.open ? this.size : 0);
        }
    }
    close() { this.setValue(0); }
    open() { this.setValue(this.size); }
    makeStyles(value) {
        const { position, handleSize, overlay } = this.props;
        let horizontal = Position.is.HORIZONTAL(position);
        if (value > this.size)
            value = this.size;
        if (value < 0)
            value = 0;
        // noinspection UnnecessaryLocalVariableJS
        let styles = {
            container: Object.assign({ zIndex: 1000, position: 'fixed' }, Position.getStyle(position), { [position]: (-this.size) + value, height: horizontal ? this.size : '100%', width: horizontal ? '100%' : this.size, boxShadow: value > 0 ? '6px 0px 20px 0px rgba(0,0,0,0.5)' : undefined }, this.props.styles.container || {}),
            inner: Object.assign({ height: '100%', width: '100%', backgroundColor: 'white' }, this.props.styles.inner || {}),
            overlay: Object.assign({ zIndex: 100, position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, [position]: value, backgroundColor: `rgba(0,0,0,${overlay ? '0.5' : '0'})` }, this.props.styles.overlay || {}),
            drawer: Object.assign({ zIndex: 10001, position: 'absolute', [Position.getOpposite(position)]: -handleSize, width: horizontal ? '100%' : handleSize, height: horizontal ? handleSize : '100%' }, this.props.styles.drawer || {})
        };
        return styles;
    }
    render() {
        const { prefix, position } = this.props;
        let direction = Position.getDirection(position);
        return (<Motion defaultStyle={{ val: 0 }} style={{ val: spring(this.value) }} onRest={() => {
            this.props.onChange(this.value >= this.size);
        }}>
                {(int) => {
            let styles = this.makeStyles(int.val);
            return (<div className={`${prefix}-container`} style={styles.container}>
                            <Hammer direction={Position.is.VERTICAL(position) ? 'DIRECTION_VERTICAL' : 'DIRECTION_HORIZONTAL'} className={`${prefix}-drawer`} style={styles.drawer} onPan={(event) => {
                if (!this.props.enableDrag) {
                    return;
                }
                if (event.direction === direction) {
                    this.open();
                }
                else if (event.direction === Direction.getOpposite(direction)) {
                    this.close();
                }
                log('onPan', { event, me: this, direction });
                this.props.onPan(event);
            }}>
                                <div />
                            </Hammer>
                            {this.value > 0 ?
                <Hammer className={`${prefix}-overlay`} style={styles.overlay} onTap={e => this.close()}>
                                 <div />
                             </Hammer> : null}
                            <div style={styles.inner}>
                                {this.props.children}
                                
                            </div>
                        </div>);
        }}
            </Motion>);
    }
};
OffCanvas.displayName = 'OffCanvas';
OffCanvas.defaultProps = {
    margin: 0,
    position: Position.LEFT,
    size: 300,
    handleSize: 50,
    prefix: 'c-off-canvas',
    open: false,
    onPan: () => null,
    onChange: () => null,
    overlay: true,
    styles: { drawer: {}, container: {}, overlay: {}, inner: {} },
    enableDrag: true
};
__decorate([
    observable,
    __metadata("design:type", Number)
], OffCanvas.prototype, "size", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], OffCanvas.prototype, "margin", void 0);
__decorate([
    observable,
    __metadata("design:type", Number)
], OffCanvas.prototype, "value", void 0);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OffCanvas.prototype, "updateSizes", null);
__decorate([
    action,
    __metadata("design:type", Object)
], OffCanvas.prototype, "setValue", void 0);
OffCanvas = __decorate([
    hot(module),
    observer
], OffCanvas);
export { OffCanvas };
export default hot(module)(OffCanvas);

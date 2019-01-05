var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import React from 'react';
import ReactDOM from 'react-dom';
import { app } from 'ioc';
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { OffCanvas, Position } from 'components/OffCanvas';
import { Checkbox, Collapse, Form, Input, InputNumber, Select, Tree } from 'antd';
import { get } from 'lodash';
import { observable } from 'mobx';
import { _colors } from 'utils/colors';
const log = require('debug')('components:store-control');
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
let StoreControl = class StoreControl extends React.Component {
    constructor() {
        super(...arguments);
        this.position = Position.RIGHT;
    }
    renderField(key, field, store) {
        if (typeof field === 'string') {
            field = { dataType: field };
        }
        field = Object.assign({ labelColSpan: 6, wrapperColSpan: 16, label: true }, field);
        let element = <div>Datatype not integrated</div>;
        if (field.dataType === 'number') {
            element = <InputNumber size="small" value={store[key]} onChange={value => store[key] = value}/>;
        }
        else if (field.dataType === 'boolean') {
            element = <Checkbox checked={store[key]} onChange={e => store[key] = !store[key]}/>;
        }
        else if (field.dataType === 'string') {
            element = <Input value={store[key]} onChange={e => store[key] = e.target.value}/>;
        }
        else if (field.dataType === 'color.name') {
            element = <Select style={{ width: '100%' }} value={store[key]} onChange={(value, option) => store[key] = value} autoClearSearchValue={true} showSearch={true}>
                <Select.Option value={null}>default</Select.Option>
                <Select.Option value="transparent">transparent</Select.Option>
                {Object.keys(_colors).map((colorKey, i) => {
                let color = _colors[colorKey];
                // log('option', { colorKey, i, color })
                return (<Select.Option key={colorKey} value={colorKey} style={{ backgroundColor: color }}>{colorKey}</Select.Option>);
            })}
            </Select>;
        }
        else if (field.dataType === 'menu') {
            field.label = false;
            field.wrapperColSpan += field.labelColSpan;
            field.labelColSpan = 0;
            let styles = {
                title: { display: 'flex', minWidth: 300, justifyContent: 'space-between' },
                key: { fontWeight: 'bold', fontSize: 12, maxWidth: 100, display: 'block' },
                value: { display: 'block', fontSize: 12 },
            };
            const renderTreeNode = (item) => {
                return (<TreeNode title={item.label} style={styles.key} key={item.id}>
                        {Object
                    .keys(item)
                    .filter(key => !['children', 'label'].includes(key))
                    .map(key => (<TreeNode key={item.id + '_' + key} style={{ padding: 0 }} title={<span style={styles.title}>
                                            <span style={styles.key}>{key}</span>
                                            <span style={styles.value}>{item[key].toString()}</span>
                                            </span>}/>))}

                        {item.children && item.children.length > 0 ? <TreeNode key={item.id + '_children'} title="children">{item.children.map(child => renderTreeNode(child))}</TreeNode> : null}
                    </TreeNode>);
            };
            element = (<Tree selectable={false}>
                    {store[key].map(item => renderTreeNode(item))}
                </Tree>);
        }
        return (<FormItem key={key} label={field.label ? key : null} labelCol={{ span: field.labelColSpan }} wrapperCol={{ span: field.wrapperColSpan }} style={{ marginBottom: 0 }}>{element}</FormItem>);
    }
    renderStore(storeKey) {
        let store = get(this.props.store, storeKey);
        let fields = this.props.stores[storeKey];
        let keys = Object.keys(fields);
        return (<Form key={storeKey} layout="horizontal" style={{ padding: 10 }}>
                {keys.map(key => this.renderField(key, fields[key], store))}
            </Form>);
    }
    render() {
        const { children, store, stores } = this.props;
        let storeKeys = Object.keys(stores);
        return (<OffCanvas position={this.position} size="40%" overlay={false} handleSize={15} styles={{ inner: { overflowY: 'scroll' } }}>
                <div style={{ textAlign: Position.getOpposite(this.position), padding: 10 }}>
                    <a onClick={e => this.position = this.position === Position.RIGHT ? Position.LEFT : Position.RIGHT}>
                        {this.position === Position.RIGHT ? '<< Move Left' : 'Move Right >>'}
                    </a>
                </div>
                <Collapse accordion>
                    {storeKeys.map(storeKey => (<Collapse.Panel key={storeKey} header={storeKey}>
                            {this.renderStore(storeKey)}
                        </Collapse.Panel>))}
                </Collapse>
            </OffCanvas>);
    }
    static create() {
        let container = document.getElementById('store-control');
        if (!container) {
            container = document.createElement('div');
            container.setAttribute('id', 'store-control');
            document.getElementById(app.config.rootID).appendChild(container);
        }
        return ReactDOM.createPortal(<div></div>, container); //<StoreControl store={{}} fields={{}}>asdf</StoreControl>
    }
};
StoreControl.displayName = 'StoreControl';
StoreControl.defaultProps = {};
__decorate([
    observable,
    __metadata("design:type", Object)
], StoreControl.prototype, "position", void 0);
StoreControl = __decorate([
    hot(module),
    observer
], StoreControl);
export { StoreControl };

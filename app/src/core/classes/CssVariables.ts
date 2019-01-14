import { color, ColorHelper, em, percent, px, rem } from 'csx';
import { ColorProperty } from 'csstype';
import { strEnsureLeft } from 'utils/general';
import { injectable } from 'inversify';

abstract class CssValue<T> {
    get raw(): T { return this._raw;};

    protected _raw: any;

    constructor(public type: string, raw: T) {
        this._raw = raw.toString().trim();
    }

    setType = (type: string) => this.type = type;

    value = () => {
        if ( typeof this[ this.type ] === 'function' ) {
            return this[ this.type ]();
        }
        return this._raw;
    };
    to    = (type: keyof this): this => {
        if ( typeof this[ type ] === 'function' ) {
            const Class = this.constructor as any;
            return new Class(type, (this[ type ] as any)()) as this;
        }
        return this;
    };

    toString(){ return this.value() }
}

export class ColorValue extends CssValue<string> {
    protected helper: ColorHelper;

    constructor(raw) {
        super('hex', raw);
        this.helper = color(this.raw);
        if ( this._raw.startsWith('#') ) {
            this.setType('hex');
        } else if ( this._raw.includes('rgb(') ) {
            this.setType('rgb');
        } else if ( this._raw.includes('rgba(') ) {
            this.setType('rgba');
        }
    }

    hex  = () => this.helper.toHexString();
    rgba = () => this.helper.toRGBA().toString();
    rgb  = () => this.helper.toRGB().toString();
}

export class UnitValue extends CssValue<string | number> {
    constructor(raw) {
        super('unit', raw);
        if ( this._raw.endsWith('px') ) {
            this.setType('px');
        } else if ( this._raw.endsWith('em') ) {
            this.setType('em');
        } else if ( this._raw.endsWith('rem') ) {
            this.setType('rem');
        } else if ( this._raw.endsWith('%') ) {
            this.setType('percent');
        } else if ( this._raw.includes('.') ) {
            this.setType('float');
        } else {
            this.setType('int');
        }
    }

    float   = () => parseFloat(this.raw as any);
    int     = () => parseInt(this.raw as any);
    px      = () => px(this.float());
    percent = () => percent(this.float());
    rem     = () => rem(this.float());
    em      = () => em(this.float());
}
@injectable()
export class CssVariables {
    protected formatKey(key) {
        key = strEnsureLeft(key, '--');
        return key;
    }

    protected getPropertyValue(key) {
        return window.getComputedStyle(document.documentElement).getPropertyValue(this.formatKey(key));
    }

    set(key: string, value: CssValue<any> | any = null, priority: string = null) {
        key = this.formatKey(key);
        if ( value instanceof CssValue ) {
            value = value.value();
        }
        document.documentElement.style.setProperty(key, value, priority);
        return this;
    }

    get(key: string, defaultValue?: string) {
        return this.has(key) ? this.getPropertyValue(key) : defaultValue;
    }

    has(key: string) {
        return this.getPropertyValue(key) !== '';
    }

    getColor(key: string, defaultValue?: ColorProperty) { return new ColorValue(this.get(key, defaultValue)); }

    getUnit(key: string, defaultValue?: any) { return new UnitValue(this.get(key, defaultValue)); }
}

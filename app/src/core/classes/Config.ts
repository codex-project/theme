import { deepClone, defined, kindOf, objectExists, objectGet, objectSet, recurse } from '@radic/util';
import { merge, template } from 'lodash';

const log = require('debug')('classes:Config');

export interface IDelimitersCollection {
    [ index: string ]: IDelimiter;
}

export interface IDelimiterLodash {
    evaluate: RegExp;
    interpolate: RegExp;
    escape: RegExp;
}

export interface IDelimiter {
    opener?: string;
    closer?: string;
    lodash?: IDelimiterLodash;
}

/**
 * Inte
 */
export interface ConfigInterface {
    get<T extends any>(prop?: any, defaultReturnValue?: any): T;

    set(prop: string | Object, value?: any): ConfigInterface;

    merge(obj: Object): ConfigInterface;

    merge(prop: string, obj: Object): ConfigInterface;

    raw(prop?: any): any;

    process(raw: any): any;

    unset(prop: any): any;

    has(prop: any): boolean;
}

export interface IConfigProperty extends ConfigInterface {
    (prop: string): any;

    (prop: Object): any;

    (prop: string, defaultReturnValue: any): any;
}

/**
 * The Config class uses object get/set methods
 * `Config` 'Config'
 * `IConfig` 'IConfig'
 * ```typescript
 * let defaultConfig = { name: 'something' }
 * let config:IConfig = new Config(defaultConfig)
 * let name = config.get('name')
 * config.set('app.version', '1.1.0')
 * let version = config.get('app.version')
 * let app = config.get('app') // returns object with app children
 * version = app.version; // also works
 * ```
 *
 * using the static `makeProperty` method, this class can be embedded into a helper function
 * ```typescript
 * let _config:IConfig = new Config(defaultConfig)
 * let config:IConfigProperty = Config.makeProperty(_config)
 * let version = config('app.version')
 * // All public methods fron Config are still available
 * config.get()
 * config.set()
 * //etc
 * ```
 * @see IConfigProperty
 * @see ConfigInterface
 * @see `Config` 'Config'
 * @see {PersistentConfig}
 */
export class Config implements ConfigInterface {
    protected defaults: Object;
    protected data: Object;
    protected allDelimiters: IDelimitersCollection;
    public static readonly propStringTmplRe: RegExp = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i;

    constructor(obj?: Object) {
        this.allDelimiters = {};
        this.addDelimiters('config', '<%', '%>');
        this.defaults = obj || {};
        try {
            this.data = JSON.parse(JSON.stringify(obj));
        } catch ( e ) {
            this.data = deepClone(obj);
        }
    }


    public unset(prop: any): any {
        prop    = prop.split('.');
        var key = prop.pop();
        var obj = objectGet(this.data, Config.getPropString(prop.join('.')));
        delete obj[ key ];
    }

    public has(prop?: any): boolean {
        return prop ? objectExists(this.data, Config.getPropString(prop)) : true;
    }

    public raw(prop?: any): any {
        if ( prop ) {
            return objectGet(this.data, Config.getPropString(prop));
        } else {
            return this.data;
        }
    }

    public get<T extends any>(prop?: any, defaultReturnValue: any = undefined): T {
        if ( ! prop || prop.toString().length === 0 ) {
            return this.process(this.raw());
        }
        return this.has(prop) ? this.process(this.raw(prop)) : defaultReturnValue;
    }

    public set(prop: string | Object, value?: any): ConfigInterface {
        if ( defined(value) ) {
            objectSet(this.data, Config.getPropString(prop), value);
        } else if ( kindOf(prop) === 'object' ) {
            Object.keys(prop).forEach(key => this.set(key, prop[ key ]));
        }
        return this;
    }

    public merge(...args: any[]): ConfigInterface {
        if ( args.length === 1 ) {
            this.data = merge(this.data, args[ 0 ]);
        } else {
            var prop: string = args[ 0 ];
            this.set(prop, merge(this.raw(prop), args[ 1 ]));
        }
        return this;
    }


    public process(raw: any): any {
        var self: Config = this;
        return recurse(raw, function (value) {
            // If the value is not a string, return it.
            if ( typeof value !== 'string' ) {
                return value;
            }
            // If possible, access the specified property via config.get, in case it
            // doesn't refer to a string, but instead refers to an object or array.
            var matches = value.match(Config.propStringTmplRe);
            var result;
            if ( matches ) {
                result = self.get(matches[ 1 ]);
                // If the result retrieved from the config data wasn't null or undefined,
                // return it.
                if ( result != null ) {
                    return result;
                }
            }
            // Process the string as a template.
            let res: any = self.processTemplate(value, { data: self.data });
            if ( res === 'true' || res === 'false' ) {
                res = res === 'true';
            } else if ( res === 'null' ) {
                res = null;
            }
            return res;
        });
    }

    private addDelimiters(name, opener, closer) {
        var delimiters: IDelimiter = this.allDelimiters[ name ] = {};
        // Used by grunt.
        delimiters.opener          = opener;
        delimiters.closer          = closer;
        // Generate RegExp patterns dynamically.
        var a                      = delimiters.opener.replace(/(.)/g, '\\$1');
        var b                      = '([\\s\\S]+?)' + delimiters.closer.replace(/(.)/g, '\\$1');
        // Used by Lo-Dash.
        delimiters.lodash          = {
            evaluate   : new RegExp(a + b, 'g'),
            interpolate: new RegExp(a + '=' + b, 'g'),
            escape     : new RegExp(a + '-' + b, 'g'),
        };
    }

    private setDelimiters(name) {
        // Get the appropriate delimiters.
        var delimiters: IDelimiter = this.allDelimiters[ name in this.allDelimiters ? name : 'config' ];

        // Tell Lo-Dash which delimiters to use.
        // templateSettings = delimiters.lodash;
        // Return the delimiters.
        return delimiters;
    }

    private processTemplate(tmpl: string, options: any): string {
        if ( ! options ) {
            options = {};
        }
        // Set delimiters, and get a opening match character.
        var delimiters = this.setDelimiters(options.delimiters);
        // Clone data, initializing to config data or empty object if omitted.
        var data       = Object.create(options.data || this.data || {});

        // Keep track of last change.
        var last = tmpl;
        try {
            // As long as tmpl contains template tags, render it and get the result,
            // otherwise just use the template string.
            while ( tmpl.indexOf(delimiters.opener) >= 0 ) {
                tmpl = template(tmpl)(data); //, delimiters.lodash);
                // Abort if template didn't change - nothing left to process!
                if ( tmpl === last ) {
                    break;
                }
                last = tmpl;
            }
        } catch ( e ) {
            // log('warning: config process template fail: ' + e.message, e);
            return '';
        }

        // Normalize linefeeds and return.
        return tmpl.toString().replace(/\r\n|\n/g, '\n');
    }


    public static makeProperty(config: ConfigInterface): IConfigProperty {
        let cf: any = function (prop?: any, defaultReturnValue?: any): any {
            if ( defined(defaultReturnValue) ) {
                return config.get(prop, defaultReturnValue);
            }
            if ( kindOf(prop) === 'object' ) {
                return config.set(prop);
            }
            return config.get(prop);
        };
        cf.get      = config.get.bind(config);
        cf.set      = config.set.bind(config);
        cf.unset    = config.unset.bind(config);
        cf.merge    = config.merge.bind(config);
        cf.raw      = config.raw.bind(config);
        cf.process  = config.process.bind(config);
        cf.has      = config.has.bind(config);

        return cf;
    }

    public static getPropString(prop: any): string {
        return Array.isArray(prop) ? prop.map(this.escape).join('.') : prop;
    }

    public static escape(str: string): string {
        return str.replace(/\./g, '\\.');
    }


    public toString() {
        return this.raw();
    }
}

export interface IDelimitersCollection {
    [index: string]: IDelimiter;
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
export interface IConfig {
    get<T extends any>(prop?: any, defaultReturnValue?: any): T;
    set(prop: string | Object, value?: any): IConfig;
    merge(obj: Object): IConfig;
    merge(prop: string, obj: Object): IConfig;
    raw(prop?: any): any;
    process(raw: any): any;
    unset(prop: any): any;
    has(prop: any): boolean;
}
export interface IConfigProperty extends IConfig {
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
 * @see IConfig
 * @see `Config` 'Config'
 * @see {PersistentConfig}
 */
export declare class Config implements IConfig {
    protected defaults: Object;
    protected data: Object;
    protected allDelimiters: IDelimitersCollection;
    protected static propStringTmplRe: RegExp;
    constructor(obj?: Object);
    unset(prop: any): any;
    has(prop?: any): boolean;
    raw(prop?: any): any;
    get<T extends any>(prop?: any, defaultReturnValue?: any): T;
    set(prop: string | Object, value?: any): IConfig;
    merge(...args: any[]): IConfig;
    process(raw: any): any;
    private addDelimiters;
    private setDelimiters;
    private processTemplate;
    static makeProperty(config: IConfig): IConfigProperty;
    static getPropString(prop: any): string;
    static escape(str: string): string;
    toString(): any;
}

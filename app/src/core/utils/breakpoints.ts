import { injectable, lazyInject } from '../ioc';
import { CssVariables, UnitValue } from '../classes/CssVariables';

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export class Breakpoint {
    constructor(protected _max: UnitValue, protected _min?: UnitValue) {
        if ( ! _min ) {this._min = new UnitValue(0);}
    }

    get min() { return this._min.to('px');}

    get max() { return this._max.to('px');}
}

@injectable()
export class Breakpoints {
    @lazyInject('cssvars') cssvars: CssVariables;

    protected getBreakpoint(key: BreakpointKey, prevKey?: BreakpointKey): Breakpoint {
        let max = this.cssvars.getUnit('breakpoint-' + key).to('int');
        let min;
        if ( prevKey ) {
            min = this.cssvars.getUnit('breakpoint-' + prevKey).to('int');
        }
        return new Breakpoint(max, min);
    }

    get keys(): BreakpointKey[] { return [ 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' ];}

    get(key: BreakpointKey): Breakpoint {return this[ key ];}

    get xs() { return this.getBreakpoint('xs');}

    get sm() { return this.getBreakpoint('sm', 'xs');}

    get md() { return this.getBreakpoint('md', 'sm');}

    get lg() { return this.getBreakpoint('lg', 'md');}

    get xl() { return this.getBreakpoint('xl', 'lg');}

    get xxl() { return this.getBreakpoint('xxl', 'xl');}
}

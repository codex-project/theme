import { margin as _margin, padding as _padding } from 'csstips';

export function padding(value: string | number) {
    let args: any[] = value as any;
    if ( typeof value === 'string' ) {
        args = value.split(' ');
    } else if ( ! Array.isArray(value) ) {
        args = [ value ];
    }
    return _padding.apply(_padding, args);
}

export function margin(value: string | number) {
    let args: any[] = value as any;
    if ( typeof value === 'string' ) {
        args = value.split(' ');
    } else if ( ! Array.isArray(value) ) {
        args = [ value ];
    }
    return _margin.apply(_margin, args);
}

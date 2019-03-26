import { PhpdocMember, PhpdocMethod, PhpdocProperty } from './types';


export const isMember   = (val: any): val is PhpdocMember => val !== undefined && val !== null && typeof val === 'object' && typeof val.type === 'string' && [ 'method', 'property' ].includes(val.type);
export const isMethod   = (val: any): val is PhpdocMethod => isMember(val) && val.type === 'method';
export const isProperty = (val: any): val is PhpdocProperty => isMember(val) && val.type === 'property';

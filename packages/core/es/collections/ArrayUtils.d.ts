export interface ArrayItemWithChildren {
    children?: any;
}
export declare class ArrayUtils {
    static flattenItems<T extends ArrayItemWithChildren>(items: T[]): T[];
    static mapItems<T extends ArrayItemWithChildren>(items: T[], cb: (item: T, parent?: T) => T, recursiveKey?: string): T[];
    static each<T extends ArrayItemWithChildren>(items: T[], cb: (item: T, parent: T | undefined) => void): void;
    static rfind<T extends ArrayItemWithChildren>(items: T[], predicate: (value: T, index: number, obj: T[]) => boolean): T;
    static rfilter<T extends ArrayItemWithChildren>(items: T[], predicate: (value: T, index: number, obj: T[]) => boolean): T[];
}

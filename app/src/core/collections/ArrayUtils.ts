export interface ArrayItemWithChildren {
    children?: any
}

export class ArrayUtils {
    static flattenItems<T extends ArrayItemWithChildren>(items: T[]) {
        let flat: T[] = [];

        const traverse = (items: T[], parent?: T) => {
            items.forEach(item => {
                flat.push(item);
                if ( item.children && item.children.length > 0 ) {
                    traverse(item.children as any, item);
                }
            });
        };

        traverse(items);

        return flat;
    }

    static mapItems<T extends ArrayItemWithChildren>(items: T[]=[], cb: (item: T, parent?: T) => T, recursiveKey: string = 'children'): T[] {
        const traverse = (items: T[]=[], parent?: T) => {
            return items.map(item => {
                item = cb(item, parent);
                if ( Array.isArray(item[ recursiveKey ]) && item[ recursiveKey ].length > 0 ) {
                    item[ recursiveKey ] = traverse(item[ recursiveKey ], item);
                }
                return item;
            });
        };
        return traverse(items);
    }

    static each<T extends ArrayItemWithChildren>(items: T[], cb: (item: T, parent: T | undefined) => void) {
        const traverse = (items: T[], parent?: T) => {
            items.forEach(item => {
                cb(item, parent);
                if ( item.children && item.children.length > 0 ) {
                    traverse(item.children as any, item);
                }
            });
        };

        traverse(items);
    }

    static rfind<T extends ArrayItemWithChildren>(items: T[], predicate: (value: T, index: number, obj: T[]) => boolean) {
        return ArrayUtils.flattenItems(items).find(predicate);
    }

    static rfilter<T extends ArrayItemWithChildren>(items: T[], predicate: (value: T, index: number, obj: T[]) => boolean) {
        return ArrayUtils.flattenItems(items).filter(predicate);
    }
}

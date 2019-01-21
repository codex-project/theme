
const A_FIRST = -1;
const LEAVE = 0;
const B_FIRST = 1;
const isEntity = (type) => ['class', 'trait', 'interface'].includes(type)
const sorter = (a,b) => {
    let sort = LEAVE;
    /*
    If compareFunction(a, b) is less than 0, sort a to an index lower than b, i.e. a comes first.
If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behaviour, and thus not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
If compareFunction(a, b) is greater than 0, sort b to a lower index than a.
compareFunction(a, b) must always return the same value when given a specific pair of elements a and b as its two arguments. If inconsistent results are returned then the sort order is undefined.
     */
    if(a.type === 'namespace'){
        sort = A_FIRST;
        if(b.type === 'namespace'){
            sort = LEAVE
        }
    }
    if(isEntity(a.type)){
        sort = B_FIRST
        if(isEntity(b.type)){
            sort = LEAVE;
        }
    }

    return sort;
}

export default sorter;

/**
 *
 * @param {T} args
 * @returns {T}
 */
export const tuple = <T extends string[]>(...args: T): T => args


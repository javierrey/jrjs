// main/core/hub.js
/*
Common local dependencies used in all contexts.
No imported dependencies; multiple contexts need different import paths.
*/ 
// @ts-check

/** Ported from jrjs/packages/lib/core/core.js:
@typedef {boolean | number | string | BigInt | null | undefined} Scalar;
@typedef {Record<string, any>} PlainObject;
@typedef {Record<number | string, any>} ArrayObject;
@typedef {{ (...args: any[]): any, [key: string]: any }} FunctionObject;
*/

/** @type {PlainObject} */
export const coreHub = {
};

// main/core/hub.js
/*
Basic core functionality without dependencies and valid in all contexts.
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

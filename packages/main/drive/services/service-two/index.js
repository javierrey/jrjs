// main/drive/services/service-two/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { log, jsonStringify, serviceBase } from '../hub.js';

/** @param {PlainObject} [params] @return {Promise<string>} */
export default async (params = {}) => {
  params.name ||= 'serviceTwo';
  return `
    <link rel="stylesheet" href="/imported/lib/view/view.css"/>
    <style>body { margin: 16px; }</style>
    <h1>${params.name}</h1>
    <pre>${jsonStringify(await serviceBase(params), null, 2)}</pre>
  `;
};

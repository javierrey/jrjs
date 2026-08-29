// main/drive/services/service-two/index.js

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { log, jsonStringify, delay, serviceBase } from '../hub.js';

/** @param {PlainObject} params @return {Promise<string>} */
const serviceTwo = async (params) => {
  await delay(1);
  params ??= {}; params.name ||= 'serviceTwo';
  const result = `
    <link rel="stylesheet" href="/imported/lib/view/view.css"/>
    <style>body { margin: 1rem; }</style>
    <h1>${params.name}</h1>
    <pre>${jsonStringify(await serviceBase(params), null, 2)}</pre>
  `;
  return result;
};

export default serviceTwo;

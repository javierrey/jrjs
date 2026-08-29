// main/drive/services/service-two/index.js

import { log, jsonStringify, serviceBase } from '../hub.js';

const serviceTwo = (params) => {
  params ??= {}; params.name ||= 'serviceTwo';
  const result = `
    <link rel="stylesheet" href="/imported/lib/view/view.css"/>
    <style>body { margin: 1rem; }</style>
    <h1>${params.name}</h1>
    <pre>${jsonStringify(serviceBase(params), null, 2)}</pre>
  `;
  return result;
};

export default serviceTwo;

// main/sys/services/service-two

import { log, jsonStringify } from './shared.js';
import serviceZero from './service-zero/index.js';

const serviceTwo = (params) => {
  params ??= {}; params.name ||= 'serviceTwo';
  const result = `
    <link rel="stylesheet" href="./imported/lib/view/view.css"/>
    <style>body { margin: 1rem; }</style>
    <h1>${params.name}</h1>
    <pre>${jsonStringify(serviceZero(params), null, 2)}</pre>
  `;
  return result;
};

export default serviceTwo;

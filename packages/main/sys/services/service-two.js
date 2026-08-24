// main/sys/services/service-two

import { log, toStr } from './shared.js';
import serviceZero from './service-zero/index.js';

const serviceTwo = (params) => {
  params ??= {}; params.name ||= 'serviceTwo';
  const result = `<h1>serviceTwo</h1><pre>${toStr(serviceZero(params))}</pre>`;
  return result;
};

export default serviceTwo;

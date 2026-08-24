// main/sys/services/service-zero

import { log } from '../shared.js';

const serviceZero = (params) => {
  const result = {
    name: params.name || 'serviceZero',
    params,
    value: Math.random(),
  }; // log.info(result);
  return result;
};

export default serviceZero;

// main/drive/services/service-zero

import { log } from '../shared.js';

const serviceZero = (params) => {
  params ??= {}; params.name ||= 'serviceZero';
  const result = {
    name: params.name,
    params,
    random: Math.random(),
  }; // log.info(result);
  return result;
};

export default serviceZero;

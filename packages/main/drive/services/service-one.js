// main/drive/services/service-one

import serviceZero from './service-zero/index.js';

const serviceOne = (params) => {
  params ??= {}; params.name ||= 'serviceOne';
  return serviceZero(params);
};

export default serviceOne;

// main/drive/services/service-one/index.js

import { serviceBase } from '../hub.js';

const serviceOne = (params) => {
  params ??= {}; params.name ||= 'serviceOne';
  return serviceBase(params);
};

export default serviceOne;

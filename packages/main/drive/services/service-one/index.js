// main/drive/services/service-one/index.js

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { serviceBase } from '../hub.js';

/** @param {PlainObject} params @return {Promise<PlainObject>} */
const serviceOne = async (params) => {
  params ??= {}; params.name ||= 'serviceOne';
  return await serviceBase(params);
};

export default serviceOne;

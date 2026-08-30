// main/drive/services/service-one/index.js

/**
@typedef {import('../services.js').PlainObject} PlainObject;
*/

import { serviceBase } from '../hub.js';

/** @param {PlainObject} params @return {Promise<PlainObject>} */
export default async (params) => {
  params ??= {}; params.name ||= 'serviceOne';
  return await serviceBase(params);
};

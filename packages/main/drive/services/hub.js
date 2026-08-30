// main/drive/services/hub.js

/**
@typedef {import('../../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
*/

import { Log, delay } from '../../../../../jrjs/packages/lib/drive/drive.js';

export * from '../../../../../jrjs/packages/lib/drive/drive.js';

export const log = Log({ name: 'services', level: 3 });

/** @param {PlainObject} params @return {Promise<PlainObject>} */
export const serviceBase = async (params) => {
  params ??= {}; params.name ||= 'serviceBase';
  return await delay(1).then(() => ({
    name: params.name,
    params,
    updated: Date.now(),
  }));
};

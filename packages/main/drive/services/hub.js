// main/drive/services/hub.js
// @ts-check

/**
@typedef {import('../../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
*/

import { Log, delay } from '../../../../../jrjs/packages/lib/drive/drive.js';
// import { coreHub } from '../../core/hub.js';

export * from '../../../../../jrjs/packages/lib/drive/drive.js';
export { stopRuntime } from '../../../../../jrjs/packages/lib/drive/cluster.js';

export const log = Log({ name: 'services', level: 3 });

const _fileurl = import.meta.url;
const moduleName = _fileurl.split('/').at(-4) ?? '';

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export const serviceBase = async (params = {}) => {
  params.name ||= 'serviceBase';
  return await delay(1).then(() => ({
    moduleName,
    name: params.name,
    params,
    updated: Date.now(),
  }));
};

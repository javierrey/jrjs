// main/drive/services/hub.js
// @ts-check

/**
@typedef {import('../../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
*/

import { contextHub, Log, delay } from '../hub.js';

export * from '../../../../../jrjs/packages/lib/drive/drive.js';
export { stopPrimaryProcess, stopWorkerProcess } from '../../../../../jrjs/packages/lib/drive/cluster.js';

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
    privateDir: contextHub.privateDir ?? '',
    updated: Date.now(),
  }));
};

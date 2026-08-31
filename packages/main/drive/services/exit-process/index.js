// main/drive/services/exit-process/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { coreHub, delay, log } from '../hub.js';

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'exitProcess';
  delay(1, () => {
    log.warn(`exiting process ${process.pid} (worker ${coreHub.workerId})`);
    process.exit(1);
  });
  return {
    pid: process.pid,
    workerId: coreHub.workerId,
    params,
    updated: Date.now(),
    status: 'worker exit scheduled',
  };
};

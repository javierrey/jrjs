// main/drive/services/break-process/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { coreHub, delay, log } from '../hub.js';

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'breakProcess';
  delay(1, () => {
    log.warn(`break-process exiting worker ${coreHub.workerId} (${process.pid})`);
    process.exit(1);
  });
  return {
    workerId: coreHub.workerId,
    pid: process.pid,
    params,
    updated: Date.now(),
    status: 'worker exit scheduled',
  };
};

// main/drive/services/stop-worker/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { contextHub, delay, stopWorkerProcess } from '../hub.js';

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'stopWorker';
  delay(1, stopWorkerProcess);
  return {
    pid: process.pid,
    workerId: contextHub.workerId,
    params,
    updated: Date.now(),
    status: 'worker process stop scheduled',
  };
};

// main/drive/services/stop-worker/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { environ, delay, stopWorkerProcess } from '../hub.js';

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'stopWorker';
  delay(1).then(stopWorkerProcess);
  return {
    pid: process.pid,
    workerId: environ.hub.workerId,
    params,
    updated: Date.now(),
    status: 'worker process stop scheduled',
  };
};

// main/drive/services/stop-primary/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { environ, delay, stopPrimaryProcess } from '../hub.js';

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'stopPrimary';
  delay(1).then(stopPrimaryProcess);
  return {
    pid: process.pid,
    workerId: environ.hub.workerId,
    params,
    updated: Date.now(),
    status: 'primary process stop scheduled',
  };
};

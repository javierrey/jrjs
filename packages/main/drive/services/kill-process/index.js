// main/drive/services/kill-process/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { contextHub, delay, log } from '../hub.js';

const killWorkerProcess = () => {
  log.warn(`killing process ${process.pid} (worker ${contextHub.workerId})`);
  process.exit(1);
};

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'killProcess';
  delay(1, killWorkerProcess);
  return {
    pid: process.pid,
    workerId: contextHub.workerId,
    params,
    updated: Date.now(),
    status: 'kill process scheduled',
  };
};

// main/drive/services/exit-process/index.js
// @ts-check

/**
@typedef {import('../hub.js').PlainObject} PlainObject;
*/

import { contextHub, delay, log } from '../hub.js';

const exitPrimaryProcess = () => {
  const pid = contextHub.workerId ? process.ppid : process.pid;
  log.warn(`exitPrimaryProcess ${pid} (from worker ${contextHub.workerId}, pid ${process.pid})`);
  process.kill(pid, 'SIGINT');
};

/** @param {PlainObject} [params] @return {Promise<PlainObject>} */
export default async (params = {}) => {
  params.name ||= 'exitProcess';
  delay(1, exitPrimaryProcess);
  return {
    pid: process.pid,
    workerId: contextHub.workerId,
    params,
    updated: Date.now(),
    status: 'primary process exit scheduled',
  };
};

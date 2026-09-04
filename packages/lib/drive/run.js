// drive/run.js
// @ts-check

/**
@typedef {import('./cluster.js').ClusterConfig} ClusterConfig;
*/

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  hydrate, log, contextHub, getArgumentValue,
} from './drive.js';
import { runCluster } from './cluster.js';

/** @type {ClusterConfig} */
const defaults = {
  clusterSize: 0,
  base: '',
  apps: [],
};

const isDirect = import.meta.url === pathToFileURL(path.resolve(process.argv[1] ?? '')).href;
const mode = getArgumentValue('stop') ? 'stop' : 'start';
const packageName = getArgumentValue('package') || 'main';
const privateFolder = getArgumentValue('private-dir') || '_exclude/_ignore';
const pidFile = path.resolve(`${privateFolder}/store/temp/run-${packageName}.pid`);

/** @return {number} */
const readPidFile = () => {
  try { return Number(fs.readFileSync(pidFile, 'utf8').trim()) || NaN; } catch (_) { return NaN; }
};

/** @param {number} pid @return {boolean} */
const isRunning = (pid) => {
  try { process.kill(pid, 0); return true;
  } catch (err) { return /** @type {NodeJS.ErrnoException} */ (err).code === 'EPERM'; }
};

const removePid = () => {
  try { fs.rmSync(pidFile, { force: true }); } catch (_err) { /* noop */ }
};

const run = () => {
  const clusterConfig = /** @type {ClusterConfig} */ (hydrate(contextHub, defaults));
  runCluster();

  log.info(`drive/run ${clusterConfig.clusterSize} workers [${clusterConfig.apps.map((app) => app.name)}]`);
};

const stop = () => {
  const pid = readPidFile();
  if (Number.isNaN(pid)) {
    removePid();
    log.info(`runtime ${packageName} not running`);
    return;
  }
  if (!isRunning(pid)) {
    removePid();
    log.info(`runtime ${packageName} not running (removed stale pid ${pid})`);
    return;
  }
  process.kill(pid, 'SIGINT');
  removePid();
  log.info(`sent SIGINT to runtime ${packageName} ${pid}`);
};

const start = async () => {
  fs.mkdirSync(path.dirname(pidFile), { recursive: true });
  const pidFileTemp = `${pidFile}.${process.pid}.tmp`;
  fs.writeFileSync(pidFileTemp, String(process.pid));
  fs.renameSync(pidFileTemp, pidFile);
  process.once('exit', removePid);

  await import(pathToFileURL(path.resolve('packages', packageName, 'drive/index.js')).href);
  run();
};

!isDirect ? run() : mode === 'stop' ? stop() : await start();

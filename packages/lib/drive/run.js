// drive/run.js
// @ts-check

/**
@typedef {import('./cluster.js').ClusterConfig} ClusterConfig;
*/

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  hydrate, log, contextHub, getArgumentValue, jsonStringify,
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
const runtimeName = getArgumentValue('runtime') || getArgumentValue('main') || 'main';
const pidFile = path.resolve(`_exclude/_ignore/store/runtime-${runtimeName}.pid`);

/** @return {{ pid: number, invalid: boolean }} */
const readPidFile = () => {
  try {
    const pidData = JSON.parse(fs.readFileSync(pidFile, 'utf8'));
    return { pid: Number(pidData.pid) || 0, invalid: false };
  } catch (_err) {
    return { pid: 0, invalid: fs.existsSync(pidFile) };
  }
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
  const { pid, invalid } = readPidFile();
  if (!pid) {
    invalid && removePid();
    log.info(invalid ? `runtime ${runtimeName} not running (removed invalid pid file)` : `runtime ${runtimeName} not running`);
    return;
  }
  if (!isRunning(pid)) {
    removePid();
    log.info(`runtime ${runtimeName} not running (removed stale pid ${pid})`);
    return;
  }
  process.kill(pid, 'SIGINT');
  removePid();
  log.info(`sent SIGINT to runtime ${runtimeName} ${pid}`);
};

const start = async () => {
  fs.mkdirSync(path.dirname(pidFile), { recursive: true });
  const pidFileTemp = `${pidFile}.${process.pid}.tmp`;
  fs.writeFileSync(pidFileTemp, JSON.stringify({ pid: process.pid, runtime: runtimeName, started: Date.now() }, null, 2));
  fs.renameSync(pidFileTemp, pidFile);
  process.once('exit', removePid);

  const hub = await import(`../../${runtimeName}/drive/hub.js`);
  log.info(`hub: ${jsonStringify(contextHub, null, 2)}`);
  contextHub.clusterSize && hub.setupClusterWorker(new URL(`../../${runtimeName}/drive/worker.js`, import.meta.url));
  run();
};

!isDirect ? run() : mode === 'stop' ? stop() : await start();

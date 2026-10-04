// lib/drive/run.js (cluster)
// @ts-check

/**
@typedef {import('./cluster.js').ClusterConfig} ClusterConfig;
*/

import { environ, log, hydrate } from './drive.js';
import { runCluster } from './cluster.js';

/** @type {ClusterConfig} */
const defaults = {
  privateDir: '',
  clusterSize: 0,
  savePid: false,
  apps: [],
};

const clusterConfig = /** @type {ClusterConfig} */ (hydrate(environ.hub, defaults));

runCluster();

log.info(`drive/run ${clusterConfig.clusterSize} workers [${clusterConfig.apps.map((app) => app.name)}]`);

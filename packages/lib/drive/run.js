// drive/run.js (cluster)
// @ts-check

/**
@typedef {import('./cluster.js').ClusterConfig} ClusterConfig;
*/

import { hydrate, log, driveConfig } from './drive.js';
import { runCluster } from './cluster.js';

/** @type {ClusterConfig} */
const defaults = {
  clusterSize: 0,
  base: '',
  apps: [],
};

const clusterConfig = /** @type {ClusterConfig} */ (hydrate(driveConfig, defaults));

runCluster();

log.info(`drive/run ${clusterConfig.clusterSize} workers [${clusterConfig.apps.map((app) => app.name)}]`);

// main/drive/index.js
// @ts-check

import { log, coreHub, jsonStringify, setupClusterWorker } from './hub.js';

log.info(`hub: ${jsonStringify(coreHub, null, 2)}`);

coreHub.clusterSize && setupClusterWorker(new URL('./worker.js', import.meta.url));

import('../../../../jrjs/packages/lib/drive/run.js');

// @remove, test examples:
// http://localhost:3000/mathfun
// http://localhost:3000/load.html?content=./content/document.md
// http://localhost:3000/service-one?p1=v%201&p2=v%202
// http://localhost:3000/exit-process

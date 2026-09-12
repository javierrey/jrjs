// main/drive/index.js
/* Runtime start script. */
// @ts-check

import { contextHub, log, jsonStringify, setupClusterWorker } from './hub.js';

log.info(`contextHub: ${jsonStringify(contextHub, null, 2)}`);

contextHub.clusterSize && setupClusterWorker(new URL('./worker.js', import.meta.url));

import('../../../../jrjs/packages/lib/drive/run.js');

// @remove, test examples:
// http://localhost:3000?load=&p1=v%201&p2=v%202
// http://localhost:3000/hub.html?load=./content/document.md&expose=CSSUtil,merge&p1=v%201&p2=v%202
// http://localhost:3000/service-one?p1=v%201&p2=v%202
// http://localhost:3000/exit-process?p1=v%201&p2=v%202

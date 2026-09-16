// main/drive/index.js
/* Runtime start script. */
// @ts-check

import { contextHub, log, jsonStringify, setupClusterWorker } from './hub.js';

log.info(`contextHub: ${jsonStringify(contextHub, null, 2)}`);

contextHub.clusterSize && setupClusterWorker(new URL('./worker.js', import.meta.url));

import('../../../../jrjs/packages/lib/drive/run.js');

// test examples, @remove comments
// http://localhost:3000?load=&theme=&p1=v%201&p2=v%202
// http://localhost:3000/test.html?load=./test/document.md&theme=dark&expose=1&p1=v%201&p2=v%202
// http://localhost:3000/service-one?p1=v%201&p2=v%202
// http://localhost:3000/stop-worker?p1=v%201&p2=v%202

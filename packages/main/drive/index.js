// main/drive/index.js
// @ts-check

import { log, driveHub, jsonStringify, setupClusterWorker } from './hub.js';

log.info(`hub: ${jsonStringify(driveHub, null, 2)}`);

setupClusterWorker(new URL('./worker.js', import.meta.url));

import('../../../../jrjs/packages/lib/drive/run.js');

// @remove, test examples:
// http://localhost:3000/mathfun
// http://localhost:3000/load.html?content=./content/document.md
// http://localhost:3000/service-one?p1=v%201&p2=v%202
// http://localhost:3000/break-process?p1=v%201&p2=v%202

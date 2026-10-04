// main/drive/index.js
/* Runtime start script. */
// @ts-check

import { environ, log, jsonStringify, setupClusterWorker } from './hub.js';

log.info(`environ: ${jsonStringify(environ, null, 2)}`);

environ.hub.clusterSize && setupClusterWorker(
	import.meta.resolve('jrjs/packages/lib/drive/worker.js'),
	{ moduleName: environ.hub.moduleName },
);

import('jrjs/packages/lib/drive/run.js');

// test examples, @remove comments
// http://localhost:3000?load=&locale=&theme=&p1=v%201&p2=v%202
// http://localhost:3000/tests?load=./document.md&locale=en-GB&theme=dark&expose=1&p1=v%201&p2=v%202
// http://localhost:3000/service-one?p1=v%201&p2=v%202
// http://localhost:3000/stop-worker?p1=v%201&p2=v%202

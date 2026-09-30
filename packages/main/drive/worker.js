// main/drive/worker.js
/* Worker thread start, set by the main process in clustered runtimes. */
// @ts-check

import { environ, merge, jsonParse, getEnvHubName } from './hub.js';

/** Populate latest environ.hub stored in environment variable if available. */
merge(environ.hub, jsonParse(process.env[getEnvHubName()] ?? ''));

import('jrjs/packages/lib/drive/run.js');

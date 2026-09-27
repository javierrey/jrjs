// main/drive/worker.js
/* Worker thread start, set by the main process in clustered runtimes. */
// @ts-check

import { contextHub, merge, jsonParse, getEnvHubName } from './hub.js';

/** Populate latest contextHub stored in environment variable if available. */
merge(contextHub, jsonParse(process.env[getEnvHubName()] ?? ''));

import('jrjs/packages/lib/drive/run.js');

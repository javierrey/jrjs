// main/drive/worker.js
/* Worker thread start, set by the main process in clustered runtimes. */
// @ts-check

import { contextHub, hydrate, jsonParse, getEnvHubName } from './hub.js';

/** Populate latest contextHub stored in environment variable if available. */
hydrate(contextHub, jsonParse(process.env[getEnvHubName()] ?? ''));

import('../../../../jrjs/packages/lib/drive/run.js');

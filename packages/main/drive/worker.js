// main/drive/worker.js
// @ts-check

import { hydrate, coreHub, jsonParse, getEnvHubName } from './hub.js';

/** Populate latest coreHub store in environment variable, if available. */
hydrate(coreHub, jsonParse(process.env[getEnvHubName()] ?? ''));

import('../../../../jrjs/packages/lib/drive/run.js');

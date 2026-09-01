// main/drive/worker.js
// @ts-check

import { contextHub, hydrate, jsonParse, getEnvHubName } from './hub.js';

/** Populate latest contextHub store in environment variable, if available. */
hydrate(contextHub, jsonParse(process.env[getEnvHubName()] ?? ''));

import('../../../../jrjs/packages/lib/drive/run.js');

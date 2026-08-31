// main/drive/worker.js
// @ts-check

import { hydrate, driveHub, jsonParse, getLatestDriveHubName } from './hub.js';

/** Populate latest driveHub from environment if available. */
hydrate(driveHub, jsonParse(process.env[getLatestDriveHubName()] ?? ''));

import('../../../../jrjs/packages/lib/drive/run.js');

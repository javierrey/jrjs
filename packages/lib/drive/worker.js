// lib/drive/worker.js
/* Worker thread start, set by the main process in clustered runtimes. */
// @ts-check

import { environ, merge, jsonParse, getEnvHubName } from './drive.js';

environ.hub.moduleName = environ.args.moduleName ?? '';

/** Populate latest environ.hub stored in environment variable if available. */
merge(environ.hub, jsonParse(process.env[getEnvHubName()] ?? ''));

import('./run.js');

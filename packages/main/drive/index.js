// main/drive/index.js
// @ts-check

import { log, hydrate, jsonParse, driveConfig } from '../../../../jrjs/packages/lib/drive/drive.js';
import config from './config.js';

const params = jsonParse(process.argv.slice(2).at(-1) || '{}');

hydrate(driveConfig, config, params);

import('../../../../jrjs/packages/lib/drive/run.js');

log.info(`driveConfig ${JSON.stringify(driveConfig, null, 2)}`);

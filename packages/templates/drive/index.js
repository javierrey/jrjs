// main/drive/index.js
// @ts-check

import { log, hydrate, jsonParse, sysConfig } from '../../../../jrjs/packages/lib/drive/drive.js';
import config from './config.js';

const params = jsonParse(process.argv.slice(2).at(-1) || '{}');

hydrate(sysConfig, config, params);

import('../../../../jrjs/packages/lib/drive/run.js');

log.info(`sysConfig ${JSON.stringify(sysConfig, null, 2)}`);

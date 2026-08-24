// main/sys/index.js
// @ts-check

import { log, hydrate, jsonParse, sysConfig } from '../../../../jrjs/packages/lib/sys/sys.js';
import config from './config.js';

const params = jsonParse(process.argv.slice(2).at(-1) || '{}');

hydrate(sysConfig, config, params);

import('../../../../jrjs/packages/lib/sys/run.js');

log.info(`sysConfig ${JSON.stringify(sysConfig, null, 2)}`);

// sys/index.js
// @ts-check

import { log, hydrate, jsonParse, sysConfig } from '../../lib/sys/sys.js';
import config from './config.js';

const params = jsonParse(process.argv.slice(2).at(-1) || '{}');

hydrate(sysConfig, params, config);

import('../../lib/sys/run.js');

log.info(`sysConfig ${JSON.stringify(sysConfig, null, 2)}`);

// main/drive/hub.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/drive/cluster.js').ClusterConfig} ClusterConfig;
@typedef {{
  moduleName: string,
  distFolder: string,
  updated: number,
}} DriveConfig;
*/

import {
  contextHub, hydrate, jsonParse,
} from '../../../../jrjs/packages/lib/drive/drive.js';
import { coreProps } from '../core/index.js';

export * from '../../../../jrjs/packages/lib/drive/drive.js';
export { getEnvHubName, setupClusterWorker } from '../../../../jrjs/packages/lib/drive/cluster.js';

const _fileurl = import.meta.url;
const distFolder = _fileurl.includes('/dist/') ? 'dist' : 'packages';
const moduleName = _fileurl.split('/').at(-3) ?? 'main';

const _inputarg = process.argv.slice(2).at(-1) || '{}';
const params = jsonParse(_inputarg) ?? {};

/** @type {PlainObject & DriveConfig & ClusterConfig} */
const driveConfig = {
  moduleName,
  distFolder,
  updated: Date.now(),
  clusterSize: 1, // 0, 1, 2, ... os.cpus().length
  base: '',
  apps: [
    {
      name: 'server',
      path: '../../../../jrjs/packages/lib/drive/server/run.js',
      primary: false,
      requires: [],
      state: {},
      config: {
        port: 3000,
        privateDir: '_ignore/store',
        publicDir: `${distFolder}/${moduleName}/view`,
        servicesDir: `${distFolder}/${moduleName}/drive/services`,
      },
    },
  ],
};

hydrate(contextHub, coreProps, driveConfig, params);

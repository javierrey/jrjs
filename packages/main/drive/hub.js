// main/drive/hub.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/drive/cluster.js').ClusterConfig} ClusterConfig;
@typedef {{
  moduleName: string;
  distFolder: string;
  privateDir: string;
  publicDir: string;
  servicesDir: string;
  updated: number;
}} DriveHub;
*/

import {
  contextHub, merge, jsonParse,
} from '../../../../jrjs/packages/lib/drive/drive.js';
import { coreHub } from '../core/hub.js';

export * from '../../../../jrjs/packages/lib/drive/drive.js';
export {
  getEnvHubName, setupClusterWorker, stopSavedPrimaryProcess,
} from '../../../../jrjs/packages/lib/drive/cluster.js';

const _fileurl = import.meta.url;
const moduleName = _fileurl.split('/').at(-3) ?? '';
const distFolder = _fileurl.includes('/dist/') ? 'dist' : 'packages';

const privateDir = '_exclude/_ignore/store';
const publicDir = `${distFolder}/${moduleName}/view`;
const servicesDir = `${distFolder}/${moduleName}/drive/services`;

const _inputarg = process.argv.slice(2).at(-1) || '{}';
const driveParams = jsonParse(_inputarg) ?? {};

/** @type {PlainObject & DriveHub & ClusterConfig} */
const driveHub = {
  moduleName,
  distFolder,
  privateDir,
  publicDir,
  servicesDir,
  updated: Date.now(),
  clusterSize: 1, // 0, 1, 2, ... os.cpus().length
  savePid: true,
  apps: [
    {
      name: 'server',
      path: '../../../../jrjs/packages/lib/drive/server/run.js',
      primary: false,
      requires: [],
      state: {},
      config: {
        port: 3000,
        privateDir,
        publicDir,
        servicesDir,
      },
    },
  ],
};

merge(contextHub, coreHub, driveHub, driveParams);

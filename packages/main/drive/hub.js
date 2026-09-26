// main/drive/hub.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').Scalar} Scalar;
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').ArrayObject} ArrayObject;
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').FunctionObject} FunctionObject;
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').DriveConfig} DriveConfig;
@typedef {import('../../../../jrjs/packages/lib/drive/cluster.js').ClusterConfig} ClusterConfig;
@typedef {import('../../../../jrjs/packages/lib/drive/server/server.js').ServerConfig} ServerConfig;
@typedef {DriveConfig & ClusterConfig & {}} DriveHub;
*/

import {
  contextHub, merge, hydrate, jsonParse,
} from '../../../../jrjs/packages/lib/drive/drive.js';
import { coreHub } from '../core/hub.js';

export * from '../../../../jrjs/packages/lib/drive/drive.js';
export {
  getEnvHubName, setupClusterWorker, stopSavedPrimaryProcess,
} from '../../../../jrjs/packages/lib/drive/cluster.js';

const fileFolders = import.meta.url.split('/'), modulePos = -3, distPos = modulePos - 1;
const moduleName = fileFolders.at(modulePos) ?? '';
const distFolder = fileFolders.at(distPos) ?? '';

const privateDir = '_exclude/_ignore/store';
const publicDir = `${distFolder}/${moduleName}/view`;
const servicesDir = `${distFolder}/${moduleName}/drive/services`;
const inputArgs = process.argv.slice(2).at(-1) || '{}';

/** @type {DriveHub} */
const driveHub = {
  moduleName,
  distFolder,
  privateDir,
  publicDir,
  servicesDir,
  clusterSize: 1, // 0, 1, 2, ... os.cpus().length
  savePid: true,
  apps: [
    {
      name: 'server',
      path: '../../../../jrjs/packages/lib/drive/server/run.js',
      primary: false,
      config: /** @type {Partial<ServerConfig>} */ ({
        port: 3000,
        privateDir,
        publicDir,
        servicesDir,
        logConfig: { level: 3 },
      }),
    },
  ],
};

const driveParams = /** @type {Partial<DriveHub>} */ (jsonParse(inputArgs) ?? {});

merge(contextHub, coreHub, driveHub);
hydrate(contextHub, driveParams);

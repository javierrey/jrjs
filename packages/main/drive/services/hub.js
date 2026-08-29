// main/drive/services/hub.js

import { Log } from '../../../../../jrjs/packages/lib/drive/drive.js';

export * from '../../../../../jrjs/packages/lib/drive/drive.js';

export const log = Log({ name: 'services', level: 3 });

export const serviceBase = (params) => {
  params ??= {}; params.name ||= 'serviceBase';
  const result = {
    name: params.name,
    params,
    random: Math.random(),
  }; // log.info(result);
  return result;
};

// lib/drive/stop.js
/* Runtime stop script. */
// @ts-check

import { environ, stopSavedPrimaryProcess } from './drive.js';

environ.hub.privateDir = environ.args.privateDir ?? '';
environ.hub.savePid = environ.args.savePid;

environ.hub.savePid && stopSavedPrimaryProcess();

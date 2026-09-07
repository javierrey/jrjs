// main/drive/stop.js
/* Runtime stop script. */
// @ts-check

import { contextHub, stopSavedPrimaryProcess } from './hub.js';

contextHub.savePid && stopSavedPrimaryProcess();

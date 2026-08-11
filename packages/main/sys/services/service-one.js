
import { Log } from '../lib/core.js';

const log = Log(0); // Log({ name: 'services', level: 3 });

const serviceOne = (params) => {
  const result = {
    name: 'serviceOne',
    params,
    value: Math.random(),
  }; // log.info(result);
  return result;
};

export default serviceOne;

import debug from 'debug';

const logger = debug('app:log');

if (ENV !== 'production') { // eslint-disable-line no-undef
  debug.enable('*');
  logger('Logging is enabled');
} else {
  debug.disable();
} 

export default logger;

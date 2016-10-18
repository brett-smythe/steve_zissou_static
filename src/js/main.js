import debug from 'debug';
const log = debug('app:log');

if (RUN_ENV !== 'production') {
  debug.enable('*');
  log('Logging is enabled');
} else {
  debug.disable();
}

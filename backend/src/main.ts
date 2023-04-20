/* eslint no-console: 0 */
import {
  floxModuleOptions,
  getActiveFloxModuleNames,
} from './flox/core/flox-helpers';
import { bootstrapNest } from './bootstrap';

// Start application
bootstrapNest()
  .then(() => {
    console.log('Backend started successfully.');
    console.log('=======================');
    getActiveFloxModuleNames().forEach((moduleName) => {
      console.log(`Module '${moduleName}':`);
      console.log(`Options: ${JSON.stringify(floxModuleOptions(moduleName))}`);
      console.log('=======================');
    });
  })
  .catch((e) => {
    console.error('Boostrapping nest failed');
    console.error(e);
  });

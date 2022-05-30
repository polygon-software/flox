import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../index';
import { MODULES } from '../../MODULES';

/**
 * The file module handles file up/download using a database table each for private and public files, as well as storing
 * the files in S3 and requesting corresponding URLs.
 */

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig = {
  // Add options here
};

/**
 * Gets the module's actual configuration
 * @returns {Record<string, unknown>} - configuration
 */
export function moduleConfig() {
  return mergeConfigurations(defaultConfig, floxModuleOptions(MODULES.FILE));
}

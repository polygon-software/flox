import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../flox';
import { MODULES } from '../../MODULES';

/**
 * The file module handles file up/download using a database table each for private and public files, as well as storing
 * the files in S3 and requesting corresponding URLs.
 */

type FileModuleConfig = {
  // TODO: once file module is set up, add options here
};

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: FileModuleConfig = {
  // TODO: once file module is set up, add options here
};

/**
 * Gets the module's actual configuration
 * @returns {FileModuleConfig} - configuration
 */
export function moduleConfig() {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.FILE),
  ) as FileModuleConfig;
}

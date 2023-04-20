import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';

/**
 * The file module handles file up/download using a database table each for private and public files, as well as storing
 * the files in S3 and requesting corresponding URLs.
 */

type FileModuleConfig = {
  // File module has no options
};

// Default configuration set; will get merged with custom config from flox.config.json
const defaultConfig: FileModuleConfig = {
  // File module has no options
};

/**
 * Gets the module's actual configuration
 *
 * @returns configuration
 */
export function moduleConfig(): FileModuleConfig {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.FILE),
  ) as FileModuleConfig;
}
export default moduleConfig;

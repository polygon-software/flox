import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';

/**
 * The file module handles file up/download using a database tables each for private and public files, as well as storing
 * the files in S3 and requesting corresponding URLs.
 */

type ImageModuleConfig = {
  // Image module has no options
};

// Default configuration set; will get merged with custom config from flox.config.json
const defaultConfig: ImageModuleConfig = {
  // Image module has no options
};

/**
 * Gets the module's actual configuration
 * @returns {FileModuleConfig} - configuration
 */
export function moduleConfig() {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.IMAGE),
  ) as ImageModuleConfig;
}

import { floxModuleOptions, mergeConfigurations } from '../../index';
import { MODULES } from '../../enum/MODULES';

/**
 * The file module handles file upload and management.
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
    floxModuleOptions(MODULES.FILE)
  ) as FileModuleConfig;
}

export default moduleConfig();

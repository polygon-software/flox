import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';

/**
 * The image module handles files that contain images and contains functionality to extract information from these
 * images, such as object recognition.
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
 *
 * @returns configuration
 */
export function moduleConfig(): ImageModuleConfig {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.IMAGE),
  ) as ImageModuleConfig;
}
export default moduleConfig;

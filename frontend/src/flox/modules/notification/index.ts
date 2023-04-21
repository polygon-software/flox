import { floxModuleOptions, mergeConfigurations } from '../../index';
import { MODULES } from '../../enum/MODULES';

/**
 * The notification module handles sending notification between users
 */

type NotificationModuleConfig = {
  // Notification module has no options
};

// Default configuration set; will get merged with custom config from flox.config.json
const defaultConfig: NotificationModuleConfig = {
  // Notification module has no options
};

/**
 * Gets the module's actual configuration
 *
 * @returns configuration
 */
export function moduleConfig(): NotificationModuleConfig {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.NOTIFICATION)
  ) as NotificationModuleConfig;
}

export default moduleConfig();

import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../index';
import { MODULES } from '../../MODULES';

/**
 * The authentication module handles Cognito authentication and provides the related decorators for checking sign-in
 * status. It does NOT include any authorization/role management; this is a separate module ('roles').
 */

type FileModuleConfig = {
  // TODO
};

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: FileModuleConfig = {
  // Add options here
};

/**
 * Gets the module's actual configuration
 * @returns {FileModuleConfig} - configuration
 */
export function moduleConfig() {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.AUTH),
  ) as FileModuleConfig;
}

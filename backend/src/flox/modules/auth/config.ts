import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../flox';
import { MODULES } from '../../MODULES';

/**
 * The authentication module handles Cognito authentication and provides the related decorators for checking sign-in
 * status. It does NOT include any authorization/role management; this is a separate module ('roles').
 */

type AuthModuleConfig = {
  // No configuration needed
};

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: AuthModuleConfig = {
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
  ) as AuthModuleConfig;
}

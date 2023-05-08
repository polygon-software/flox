import { floxModuleOptions, mergeConfigurations } from '../../index';
import { MODULES } from '../../enum/MODULES';

/**
 * The authentication module handles Cognito authentication and provides the related decorators for checking sign-in
 * status. It does NOT include any authorization/role management; this is a separate module ('roles').
 */

type AuthModuleConfig = {
  emailAsUsername: boolean; // Whether the Cognito user pool is set to use the e-mail address as username
  useTwoFactor: boolean;
};

// Default configuration set; will get merged with custom config from flox.config.json
const defaultConfig: AuthModuleConfig = {
  emailAsUsername: false,
  useTwoFactor: false,
};

/**
 * Gets the module's actual configuration
 *
 * @returns configuration
 */
export function moduleConfig(): AuthModuleConfig {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.AUTH)
  ) as AuthModuleConfig;
}

export default moduleConfig();

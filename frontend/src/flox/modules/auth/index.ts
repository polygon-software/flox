import {floxModuleOptions, mergeConfigurations} from '../../index';
import { MODULES } from '../../MODULES';

/**
 * The authentication module handles Cognito authentication and provides the related decorators for checking sign-in
 * status. It does NOT include any authorization/role management; this is a separate module ('roles').
 */

type FileModuleConfig = {
  twoFactor: boolean, // Whether to use 2FA
  emailAsUsername: boolean, // Whether the Cognito user pool is set to use the e-mail address as username
};

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: FileModuleConfig = {
  twoFactor: true,
  emailAsUsername: false,
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
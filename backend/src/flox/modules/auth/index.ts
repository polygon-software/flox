import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../index';
import { MODULES } from '../../MODULES';

/**
 * The authentication module handles Cognito authentication and provides the related decorators for checking sign-in
 * status. It does NOT include any authorization/role management; this is a separate module ('roles').
 */

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig = {
  // Add options here
};

// Actual module configuration
export const moduleConfig = mergeConfigurations(
  defaultConfig,
  floxModuleOptions(MODULES.AUTH),
);

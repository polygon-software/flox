import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../index';
import { MODULES } from '../../MODULES';

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig = {
  // Add options here
};

// Actual module configuration
export const moduleConfig = mergeConfigurations(
  defaultConfig,
  floxModuleOptions(MODULES.AUTH),
);

import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../index';
import { MODULES } from '../../MODULES';

// Default roles
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig = {
  roles: Object.keys(ROLES), // Available roles
  strict: true, // Set queries/mutations without decorators to be disallowed
};

// Actual module configuration
export const moduleConfig = mergeConfigurations(
  defaultConfig,
  floxModuleOptions(MODULES.ROLES),
);

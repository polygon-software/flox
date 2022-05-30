import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../index';
import { MODULES } from '../../MODULES';

/**
 * The roles module includes role management functionalities and decorators for restricting certain resources to certain
 * user types.
 */

// Default roles
export enum DEFAULT_ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig = {
  roles: Object.values(DEFAULT_ROLES), // Available roles
  strict: true, // Set queries/mutations where no authorization decorators are given to be access-restricted by default
};

// Actual module configuration
export const moduleConfig = mergeConfigurations(
  defaultConfig,
  floxModuleOptions(MODULES.ROLES),
);

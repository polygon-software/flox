import { mergeConfigurations } from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';
import { floxModuleOptions } from '../..';

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

/**
 * Gets the module's actual configuration
 * @returns {Record<string, unknown>} - configuration
 */
export function moduleConfig() {
  return mergeConfigurations(defaultConfig, floxModuleOptions(MODULES.ROLES));
}

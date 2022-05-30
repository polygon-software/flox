import { mergeConfigurations } from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';
import { floxModuleOptions } from '../..';

/**
 * The roles module includes role management functionalities and decorators for restricting certain resources to certain
 * user types.
 */

type RoleModuleConfig = {
  roles: string[]; // Available roles
  strict: boolean; // Set queries/mutations where no authorization decorators are given to be access-restricted by default
};

// Default roles
export enum DEFAULT_ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: RoleModuleConfig = {
  roles: Object.values(DEFAULT_ROLES),
  strict: true,
};

/**
 * Gets the module's actual configuration
 * @returns {RoleModuleConfig} - module configuration
 */
export function moduleConfig() {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.ROLES),
  ) as RoleModuleConfig;
}

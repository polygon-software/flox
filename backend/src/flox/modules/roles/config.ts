import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';

/**
 * The roles module includes role management functionalities and decorators for restricting certain resources to certain
 * user types.
 */

type RoleModuleConfig = {
  roles: string[]; // Available roles
  strict: boolean; // Set queries/mutations where no authorization decorators are given to be access-restricted by default
};

// Default roles
export enum DefaultRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Default configuration set; will get merged with custom config from flox.config.json
const defaultConfig: RoleModuleConfig = {
  roles: Object.values(DefaultRoles),
  strict: true,
};

/**
 * Gets the module's actual configuration
 *
 * @returns module configuration
 */
export function moduleConfig(): RoleModuleConfig {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.ROLES),
  ) as RoleModuleConfig;
}

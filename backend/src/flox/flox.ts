import * as flox from '../flox.config.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../flox-modules/auth/roles.guard';
import { JwtStrategy } from '../flox-modules/auth/jwt.strategy';
import { JwtAuthGuard } from '../flox-modules/auth/auth.guard';

/**
 * Returns the providers to use based on flox.config.js
 * @returns {any[]} - provider list TODO
 */
export function floxProviders() {
  const providers = [];

  // Get active modules from config
  const modules = getActiveFloxModules();

  // Add providers for each module
  modules.forEach((moduleName) => {
    if (flox.modules[moduleName] === true) {
      switch (moduleName) {
        // Authentication module (includes JSON web token validation)
        case 'auth':
          providers.push(JwtStrategy);
          providers.push({
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
          });
          break;
        // Role management module
        case 'roles':
          providers.push({
            provide: APP_GUARD,
            useClass: RolesGuard,
          });
          break;
        case 'file':
          // TODO
          break;
        default:
          break;
      }
    }
  });

  return providers;
}

/**
 * Gets the active Flox modules from config
 * @returns {string[]} - list of module names
 */
function getActiveFloxModules() {
  const modules = [];

  Object.keys(flox.modules).forEach((moduleName) => {
    if (flox.modules[moduleName] === true) {
      modules.push(moduleName);
    }
  });

  return modules;
}

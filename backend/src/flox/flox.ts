import * as flox from '../../flox.config.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/roles.guard';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';

/**
 * Returns the active Flox modules based on flox.config.js
 * @returns {any[]} - list of Modules
 */
export function floxModules() {
  const modules = [];

  // Get active modules from config
  const moduleNames = getActiveFloxModuleNames();

  moduleNames.forEach((moduleName) => {
    switch (moduleName) {
      case 'file':
        modules.push(FileModule);
        break;
      case 'user':
        modules.push(UserModule);
        break;
      // Some modules don't have to be added
      default:
        break;
    }
  });

  return modules;
}

/**
 * Returns the providers to use based on flox.config.js
 * @returns {any[]} - list of providers
 */
export function floxProviders() {
  const providers = [];

  // Get active modules from config
  const moduleNames = getActiveFloxModuleNames();

  // Add providers for each module
  moduleNames.forEach((moduleName) => {
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
function getActiveFloxModuleNames() {
  const modules = [];

  Object.keys(flox.modules).forEach((moduleName) => {
    if (flox.modules[moduleName] === true) {
      modules.push(moduleName);
    }
  });

  return modules;
}

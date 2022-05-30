import * as flox from '../../flox.config.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/roles/roles.guard';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/auth/user.module';
import { MODULES } from './MODULES';

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
        case MODULES.AUTH:
          providers.push(JwtStrategy);
          providers.push({
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
          });
          break;
        // Role management module
        case MODULES.ROLES:
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

/**
 * Gets the active Flox modules' options (with proper typing, since config is .js)
 * @returns {Record<string, Record<string, unknown>>} - options for active modules
 */
export function floxModulesOptions() {
  const options: Record<string, Record<string, unknown>> = {};

  // Get active modules
  const modules = floxModules();

  modules.forEach((module) => {
    options[module] = (flox.moduleOptions[module] ?? {}) as Record<
      string,
      unknown
    >;
  });

  return options;
}

/**
 * Gets the options for a single Flox module (with proper typing, since config is .js)
 * @param {string} moduleName - name of the module to check
 * @returns {Record<string, Record<string, unknown>>} - options for the modules
 */
export function floxModuleOptions(moduleName: string) {
  return (flox.moduleOptions[moduleName] ?? {}) as Record<string, unknown>;
}

/**
 * Determines whether a Flox module is currently active from flox.config.js
 * @param {string} moduleName - name of the module to check
 * @returns {boolean} - whether the module is active
 */
export function isModuleActive(moduleName: string) {
  return getActiveFloxModuleNames().includes(moduleName);
}

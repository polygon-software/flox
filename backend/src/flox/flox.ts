import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/roles/roles.guard';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/auth/user.module';
import { MODULES } from './MODULES';
import PublicFile from './modules/file/entities/public_file.entity';
import PrivateFile from './modules/file/entities/private_file.entity';
import { User } from './modules/auth/entities/user.entity';
import { getActiveFloxModuleNames } from './core/flox-helpers';

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
      case MODULES.FILE:
        modules.push(FileModule);
        break;
      case MODULES.AUTH:
        modules.push(UserModule);
        break;
      // Some modules don't have to be added (e.g. 'roles')
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
  });

  return providers;
}

/**
 * Determines the GraphQL entities needed by Flox modules
 * @returns {any[]} - entities
 */
export function floxEntities() {
  const entities = [];

  getActiveFloxModuleNames().forEach((module) => {
    switch (module) {
      case MODULES.AUTH:
        entities.push(User);
        break;
      case MODULES.FILE:
        entities.push(PrivateFile);
        entities.push(PublicFile);
        break;
      default:
        break;
    }
  });

  return entities;
}

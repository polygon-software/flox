import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/roles/roles.guard';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/auth/user.module';
import { MODULES } from './MODULES';
import { EmailModule } from './modules/email/email.module';
import { getActiveFloxModuleNames } from './core/flox-helpers';

/**
 * Returns the active Flox modules based on flox.config.json
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
      case MODULES.EMAIL:
        modules.push(EmailModule);
        break;
      // Some modules don't have to be added (e.g. 'roles')
      default:
        break;
    }
  });

  return modules;
}

/**
 * Returns the providers to use based on flox.config.json
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

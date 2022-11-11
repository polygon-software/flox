import { APP_GUARD } from '@nestjs/core';

import { getActiveFloxModuleNames } from './core/flox-helpers';
import JwtAuthGuard from './modules/auth/auth.guard';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { UserModule } from './modules/auth/user.module';
import { EmailModule } from './modules/email/email.module';
import { FileModule } from './modules/file/file.module';
import { ImageModule } from './modules/image/image.module';
import { RolesGuard } from './modules/roles/roles.guard';
import { NotificationModule } from './modules/notifications/notification.module';
import { MODULES } from './MODULES';

export type FloxModules = FileModule | ImageModule | UserModule | EmailModule;

/**
 * Returns the active Flox modules based on flox.config.json
 * @returns list of Modules
 */
export function floxModules(): FloxModules[] {
  const modules: FloxModules[] = [];

  // Get active modules from config
  const moduleNames = getActiveFloxModuleNames();

  moduleNames.forEach((moduleName) => {
    switch (moduleName) {
      case MODULES.FILE:
        modules.push(FileModule);
        break;
      case MODULES.IMAGE:
        modules.push(ImageModule);
        break;
      case MODULES.AUTH:
        modules.push(UserModule);
        break;
      case MODULES.EMAIL:
        modules.push(EmailModule);
        break;
      case MODULES.NOTIFICATION:
        modules.push(NotificationModule);
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
 * @returns list of providers
 */
export function floxProviders(): any[] {
  const providers: any[] = [];

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

import { SetMetadata } from '@nestjs/common';

/**
 * Defines role-specific decorators
 */

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const AdminOnly = () => SetMetadata('roles', ['admin']);

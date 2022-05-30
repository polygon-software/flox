import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLES } from './ROLES';

/**
 * Defines authorization-specific decorators
 */

export const ANY_ROLE_KEY = 'anyRole';
export const ROLES_KEY = 'roles';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator =>
  SetMetadata(ROLES_KEY, [ROLES.ADMIN]); // TODO from enum

// Allows access with any role
export const AnyRole = (): CustomDecorator => SetMetadata(ANY_ROLE_KEY, true);

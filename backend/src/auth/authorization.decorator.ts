import {
  createParamDecorator,
  CustomDecorator,
  SetMetadata,
} from '@nestjs/common';
import { getRequest } from '../helpers';
import { ROLE } from '../ENUM/ENUM';

/**
 * Defines authorization-specific decorators
 */

export const ANY_ROLE_KEY = 'anyRole';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator =>
  SetMetadata('roles', [ROLE.ADMIN]);

// Allows access with any role
export const AnyRole = (): CustomDecorator => SetMetadata(ANY_ROLE_KEY, true);

// Access to current user from request
// The user record has the form { userId: string, username: string }
export const CurrentUser = createParamDecorator(
  (data, req) => getRequest(req).user,
);

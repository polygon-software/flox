import {
  createParamDecorator,
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { ROLES } from './ROLES';
import { getRequest } from '../../core/flox-helpers';

/**
 * Defines authorization-specific (roles) decorators
 */

export const ANY_ROLE_KEY = 'anyRole';
export const ROLES_KEY = 'roles';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator =>
  SetMetadata(ROLES_KEY, [ROLES.ADMIN]);

// Allows access with any role
export const AnyRole = (): CustomDecorator => SetMetadata(ANY_ROLE_KEY, true);

// Access to current user from request
// The user record has the form { userId: string, username: string }
export const CurrentUser = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  (data, req: ExecutionContext) => getRequest(req).user,
);

// Access to the IP from request
export const UserIP = createParamDecorator(
  (data, req: ExecutionContext) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    getRequest(req).headers['x-forwarded-for'] ?? 'localhost',
);

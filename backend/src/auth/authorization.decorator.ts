import {
  createParamDecorator,
  CustomDecorator,
  SetMetadata,
} from '@nestjs/common';
import { getRequest } from '../helpers';

/**
 * Defines authorization-specific decorators
 */

export const IS_MINE_KEY = 'isMine';
export const ANY_ROLE_KEY = 'anyRole';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator => SetMetadata('roles', ['admin']);

// Allows access with any role
export const AnyRole = (): CustomDecorator => SetMetadata(ANY_ROLE_KEY, true);

// TODO: Application-specific role decorators go here

// Restrict to resources owned by me (where 'owner' is the user's UUID)
export const Mine = (): CustomDecorator => SetMetadata(IS_MINE_KEY, true);

// Access to current user from request
export const CurrentUser = createParamDecorator(
  (data, req) => getRequest(req).user,
);

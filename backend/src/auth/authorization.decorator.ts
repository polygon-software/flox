import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Defines authorization-specific decorators
 */

export const IS_MINE_KEY = 'isMine';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator => SetMetadata('roles', ['admin']);

// TODO: Application-specific role decorators go here

// Restrict to resources owned by me (where 'owner' is the user's UUID)
export const Mine = (): CustomDecorator => SetMetadata(IS_MINE_KEY, true);

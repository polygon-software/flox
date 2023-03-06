import {
  createParamDecorator,
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

import { getRequest } from '../../core/flox-helpers';
import User from '../auth/entities/user.entity';
import { CognitoUserType } from '../auth/types/cognito-user.type';

import { DefaultRoles } from './config';

/**
 * Defines authorization-specific (roles) decorators
 */

export const ROLES_KEY = 'roles';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator =>
  SetMetadata(ROLES_KEY, [DefaultRoles.ADMIN]);

// Access to current user from request
export const CurrentUser = createParamDecorator(
  (data, req: ExecutionContext): User => {
    return getRequest(req).principal as User;
  },
);

// Access to current user from request if available
export const OptionalUser = createParamDecorator(
  (data, req: ExecutionContext): User | null => {
    const { principal } = getRequest(req);
    return principal ?? null;
  },
);

// Access to cognito user from request in the formPages { userId: string, username: string }
export const OptionalCognitoUser = createParamDecorator(
  (data, req: ExecutionContext): CognitoUserType | null => {
    const { user } = getRequest(req);
    return user ?? null;
  },
);

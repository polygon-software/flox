import {
  createParamDecorator,
  CustomDecorator,
  SetMetadata,
} from '@nestjs/common';

import { getRequest } from '../helpers';
import { ROLE } from '../ENUM/ENUMS';

/**
 * Defines authorization-specific decorators
 */
export const ANY_ROLE_KEY = 'anyRole';

// Restrict to specified roles
export const Roles = (...roles: string[]): CustomDecorator =>
  SetMetadata('roles', roles);

// Restrict to admin role
export const AdminOnly = (): CustomDecorator =>
  SetMetadata('roles', [ROLE.SOI_ADMIN]);

// Allows access with any role
export const AnyRole = (): CustomDecorator => SetMetadata(ANY_ROLE_KEY, true);

export const SOIOnly = (): CustomDecorator =>
  SetMetadata('roles', [ROLE.SOI_ADMIN, ROLE.SOI_EMPLOYEE]);

export const CompanyOnly = (): CustomDecorator =>
  SetMetadata('roles', [ROLE.COMPANY]);

export const EmployeeOnly = (): CustomDecorator =>
  SetMetadata('roles', [ROLE.EMPLOYEE]);

export const BankOnly = (): CustomDecorator =>
  SetMetadata('roles', [ROLE.BANK]);
// Access to current user from request
export const CurrentUser = createParamDecorator(
  (data, req) => getRequest(req).user,
);

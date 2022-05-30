import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth/authentication.decorator';
import { ANY_ROLE_KEY } from './authorization.decorator';
import { getRequest } from '../../core/flox-helpers';

/**
 * Role-based authorization guard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the user can access a given query/mutation
   * @param {ExecutionContext} context - executionContext
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - whether the access is allowed
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // If no roles are specified, allow access only on public resources OR any role
    if (!roles || roles.length === 0) {
      // Determine if resource is public
      const isPublic: boolean =
        this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) ?? false;

      // Determine if resource is accessible to any logged-in user
      const anyRole: boolean =
        this.reflector.getAllAndOverride<boolean>(ANY_ROLE_KEY, [
          context.getHandler(),
          context.getClass(),
        ]) ?? false;

      // For publicly accessible resources, allow access by default
      return isPublic || anyRole;
    }
    const req = getRequest(context);
    const user = req.user;
    user.roles = []; // TODO Application-specific: Determine user's roles here
    return this.matchRoles(roles, user.roles);
  }

  /**
   * Checks if any of the user's roles have access to the specified resource
   * @param {string[]} allowedRoles - the list of roles that have resource access
   * @param {string[]} userRoles - the list of the user's roles
   * @returns {boolean} - whether access is allowed
   */
  matchRoles(allowedRoles: string[], userRoles: string[]) {
    return userRoles.some((userRole) => allowedRoles.includes(userRole));
  }
}

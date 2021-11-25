import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Guard used for defining which roles can access a specific method
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    console.log('User is', user);
    // TODO Application-specific: Determine user's roles here
    user.roles = ['admin', 'peasant'];
    return this.matchRoles(roles, user.roles);
  }

  /**
   * Checks if any of the user's roles have access to the specified resource
   * @param {string[]} allowedRoles
   * @param {string[]} userRoles
   */
  matchRoles(allowedRoles: string[], userRoles: string[]) {
    console.log('matching roles', allowedRoles, 'to user', userRoles);
    return userRoles.some((userRole) => allowedRoles.includes(userRole));
  }
}

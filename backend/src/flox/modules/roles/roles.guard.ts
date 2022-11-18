import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FrontendRequest, getRequest } from '../../core/flox-helpers';
import { IS_PUBLIC_KEY, LOGGED_IN_KEY } from '../auth/authentication.decorator';
import GetUserArgs from '../auth/dto/args/get-user.args';
import User from '../auth/entities/user.entity';
import UserService from '../auth/user.service';

import { DEFAULT_ROLES } from './config';

/**
 * Guard used for defining which roles can access a specific method
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * @param reflector - nest reflector
   * @param userService - user service, needed to retrieve user from database
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  /**
   * Gets the request from context
   *
   * @param context - request execution context
   * @returns request
   */
  getRequest(context: ExecutionContext): FrontendRequest {
    return getRequest(context);
  }

  /**
   * Validate that the user has appropriate rights to activate API endpoint.
   *
   * @param context - context
   * @returns can activate
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const user = req.user;
    let dbUser: User | undefined = undefined;

    console.log('---user', user);

    // Set user in request object
    if (user) {
      dbUser = await this.userService.getUser({
        cognitoUuid: user.userId,
      } as GetUserArgs);

      // Handle the case in which an alias is provided in header
      const alias = req.headers['user-alias'];
      if (dbUser.role === DEFAULT_ROLES.ADMIN && alias) {
        dbUser = await this.userService.getUser({
          uuid: alias,
        } as GetUserArgs);
      }

      // Set either cognito user or alias user as principal to request
      req.principal = dbUser;
      console.log('Setting principal', dbUser);
    }

    // Public endpoints are generally accessible
    if (this.isPublic(context)) {
      return true;
    }

    // If endpoint is not public, user must always be authenticated
    if (!dbUser) {
      return false;
    }

    // Admin has access to everything
    if (dbUser && dbUser.role === DEFAULT_ROLES.ADMIN) {
      return true;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // For generally accessible resources, allow access by default if user is logged in
    const anyUserAccess = this.isLoggedIn(context, roles, dbUser);
    if (anyUserAccess) {
      return true;
    }
    return roles ? roles.includes(dbUser.role) : false;
  }

  /**
   * whether endpoint is Public
   *
   * @param context - context
   * @returns  is public
   */
  isPublic(context: ExecutionContext): boolean {
    // Determine if resource is public
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false
    );
  }

  /**
   * Checks if the user is logged in and the access control is "loggedIn", allowing access to all logged in users
   *
   * @param context - context
   * @param roles - whitelisted roles
   * @param dbUser - the requesting user
   * @returns whether any user can activate
   */
  isLoggedIn(
    context: ExecutionContext,
    roles: string[],
    dbUser: User | undefined,
  ): boolean {
    if (!roles || roles.length === 0) {
      // Determine if resource is accessible to any logged-in user
      return (
        !!dbUser &&
        this.reflector.getAllAndOverride<boolean>(LOGGED_IN_KEY, [
          context.getHandler(),
          context.getClass(),
        ])
      );
    }
    return false;
  }
}

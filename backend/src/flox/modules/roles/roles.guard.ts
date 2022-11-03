import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import Env from '../../../env';
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
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  /**
   * Gets the request from context
   * @param context - request execution context
   * @returns request
   */
  getRequest(context: ExecutionContext): FrontendRequest {
    return getRequest(context);
  }

  /**
   * Validate that the user has appropriate rights to activate API endpoint.
   * @param context - context
   * @returns can activate
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublic(context);
    if (isPublic) {
      return true;
    }

    // Dev mode: overrides user management:
    const accessOverride = Env.DEV;
    const requestedFunction = context.getHandler().name;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = this.getRequest(context);
    const user = req.user;
    let dbUser: User | undefined = undefined;

    console.log(user, 'user');
    if (user) {
      dbUser = await this.userService.getUser({
        cognitoUuid: user.userId,
      } as GetUserArgs);

      // Handle the case in which an alias is provided in header
      const alias = req.headers['user-alias'];
      console.log('alias', alias);
      if (dbUser.role === DEFAULT_ROLES.ADMIN && alias) {
        dbUser = await this.userService.getUser({
          uuid: alias,
        } as GetUserArgs);
      }

      // Set either cognito user or alias user as principal to request
      req.principal = dbUser;

      // Admin has access to everything
      if (dbUser && dbUser.role === DEFAULT_ROLES.ADMIN) {
        return true;
      }
    }

    // For generally accessible resources, allow access by default if user is logged in
    const anyUserAccess = this.isLoggedIn(context, roles, dbUser);
    if (anyUserAccess) {
      return true;
    }

    // Development override for private resources
    if (accessOverride && !roles) {
      console.warn(
        `Debug override used to access private resource: "${requestedFunction}"!`,
      );
      return true;
    }

    // Development override for restricted resources without being logged in
    if (!dbUser) {
      if (accessOverride) {
        console.warn(
          `Debug override used to access restricted resource: "${requestedFunction}" without authentication!`,
        );
        return true;
      }
      return false;
    }
    const res = roles ? roles.includes(dbUser.role) : false;
    if (accessOverride && !res) {
      console.warn(
        `Debug override used to access resource : "${requestedFunction}" restricted to ${roles?.join(
          ',',
        )} as ${dbUser.role}!`,
      );
      return true;
    }
    return res;
  }

  /**
   * whether endpoint is Public
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

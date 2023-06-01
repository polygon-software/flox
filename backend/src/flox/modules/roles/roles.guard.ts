import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getRequest } from '../../core/flox-helpers';
import {
  IS_BASIC_AUTHENTICATED_KEY,
  IS_PUBLIC_KEY,
  LOGGED_IN_KEY,
} from '../auth/authentication.decorator';
import User from '../auth/entities/user.entity';
import UserService from '../auth/user.service';
import { basicAuth } from '../auth/helpers/auth.helper';

import { DefaultRoles } from './config';

/**
 * Guard used for defining which roles can access a specific method
 */
@Injectable()
export default class RolesGuard implements CanActivate {
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
   * @param context - execution context of the request
   * @returns the request
   */
  getRequest(context: ExecutionContext): ReturnType<typeof getRequest> {
    return getRequest(context);
  }

  /**
   * Validate that the user has appropriate rights to activate API endpoint.
   *
   * @param context - context
   * @returns can activate
   */
  canActivate(context: ExecutionContext): boolean {
    const req = this.getRequest(context);
    const { principal } = req;

    // Public endpoints are generally accessible
    if (this.isPublic(context)) {
      return true;
    }

    // Endpoint is accessible if basic auth is used
    if (this.isBasicAuthenticated(context)) {
      return true;
    }

    // If endpoint is not public, user must always be authenticated
    if (!principal) {
      return false;
    }

    // Admin has access to everything
    if (principal && principal.role === DefaultRoles.ADMIN) {
      return true;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // For generally accessible resources, allow access by default if user is logged in
    const anyUserAccess = this.isLoggedIn(context, roles, principal);
    if (anyUserAccess) {
      return true;
    }
    return roles ? roles.includes(principal.role) : false;
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
   * Checks if the user is logged in and the access control is "loggedIn", allowing access to all logged-in users
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

  /**
   * Determines whether the request is authenticated via basic auth
   *
   * @param context - execution context
   * @returns whether the request is authenticated
   */
  isBasicAuthenticated(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const usesDecorator = this.reflector.getAllAndOverride<boolean>(
      IS_BASIC_AUTHENTICATED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (usesDecorator && request) {
      const authorizationHeader = (
        request.headers as unknown as Record<string, string>
      ).authorization;
      basicAuth(authorizationHeader);
      return true;
    }
    return false;
  }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { getRequest } from '../../core/flox-helpers';

import {
  IS_BASIC_AUTHENTICATED_KEY,
  IS_PUBLIC_KEY,
} from './authentication.decorator';
import { basicAuth } from './helpers/auth.helper';

/**
 * JSON Web token authentication guard
 */
@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Constructor
   *
   * @param reflector - reflector
   */
  constructor(private reflector: Reflector) {
    super();
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
   * Gets the request from context
   * This method is required, do not remove!
   *
   * @param context - execution context of the request
   * @returns the request
   */
  getRequest(context: ExecutionContext): ReturnType<typeof getRequest> {
    return getRequest(context);
  }

  /**
   * Determines whether a user can activate the route based on the authentication status
   *
   * @param  context - execution context
   * @returns - whether the user can activate
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch (e) {
      // Only allow access without valid JWT if endpoint is public or basic auth is used
      if (!this.isPublic(context) && !this.isBasicAuthenticated(context)) {
        throw e;
      }
    }
    return true;
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

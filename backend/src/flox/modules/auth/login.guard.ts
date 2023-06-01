import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getRequest } from '../../core/flox-helpers';

import {
  IS_BASIC_AUTHENTICATED_KEY,
  IS_PUBLIC_KEY,
} from './authentication.decorator';
import { basicAuth } from './helpers/auth.helper';

@Injectable()
export default class LoginGuard implements CanActivate {
  /**
   * Constructor
   *
   * @param reflector - reflector
   */
  constructor(private reflector: Reflector) {}

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
   * Checks whether the user is logged in or endpiont is public
   *
   * @param context - request execution context
   * @returns whether endpoint is accessible
   */
  canActivate(context: ExecutionContext): boolean {
    const req = this.getRequest(context);
    const { principal } = req;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return !!principal || isPublic || this.isBasicAuthenticated(context);
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

import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getRequest } from '../../core/flox-helpers';

import { IS_PUBLIC_KEY } from './authentication.decorator';

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

    return !!principal || isPublic;
  }
}

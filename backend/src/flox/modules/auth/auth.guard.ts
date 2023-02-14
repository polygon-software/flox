import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { getRequest } from '../../core/flox-helpers';

import { IS_PUBLIC_KEY } from './authentication.decorator';

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
   * Gets the request from context
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
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // For publicly accessible resources, allow access by default
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

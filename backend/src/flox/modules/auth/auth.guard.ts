import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    // eslint-disable-next-line no-console
    console.log('AUTH');
    // eslint-disable-next-line no-console
    console.log('public:', this.isPublic(context));

    try {
      await super.canActivate(context);
    } catch (e) {
      // Only allow access without valid JWT if endpoint is public
      if (!this.isPublic(context)) {
        throw e;
      }
    }
    return true;
  }
}

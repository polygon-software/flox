import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { getRequest } from 'src/flox/core/flox-helpers';
import { IS_PUBLIC_KEY } from './authentication.decorator';

/**
 * JSON Web token authentication guard
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Constructor
   * @param {Reflector} reflector - reflector
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Gets the request from context
   * @param {ExecutionContext} context - execution context of the request
   * @returns {any} - the request
   */
  getRequest(context: ExecutionContext): any {
    return getRequest(context);
  }

  /**
   * Determines whether a user can activate the route based on the authentication status
   * @param {ExecutionContext} context - execution context
   * @returns {boolean} - whether the user can activate
   */
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('AUTH canActivate');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // For publicly accessible resources, allow access by default
    if (isPublic) {
      return true;
    }
    console.log('non-public', context);
    return super.canActivate(context);
  }
}

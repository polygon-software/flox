import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './authentication.decorator';
import { getRequest } from '../helpers';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Executed upon receiving a request for a protected endpoint
   * @param {ExecutionContext} context - the request's context
   */
  getRequest(context: ExecutionContext): any {
    return getRequest(context);
  }

  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines whether the user can activate a given endpoint
   * @param {ExecutionContext} context - the request's context
   */
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Getting canActivate for', context.getArgs());
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

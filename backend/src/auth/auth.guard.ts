import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './authentication.decorator';
import { getRequest } from '../helpers';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Gets the request from context
   * @param {ExecutionContext} context
   */
  getRequest(context: ExecutionContext): any {
    return getRequest(context);
  }

  constructor(private reflector: Reflector) {
    super();
  }

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

import { CustomDecorator, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Executed upon receiving a request for a protected endpoint
   * @param {ExecutionContext} context - the request's context
   */
  getRequest(context: ExecutionContext): any {
    console.log('Get request!', context);
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
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
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

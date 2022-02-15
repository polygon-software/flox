import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './authentication.decorator';

@Injectable()
/**
 * JSON Web token auth guard
 */
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Gets the request from context
   * @param {ExecutionContext} context - execution context of the request
   * @returns {any} - the request
   */
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    // If call is not from GraphQL, get req regularly
    if (!ctx.getContext()) {
      return context.switchToHttp().getRequest();
    }
    // Call is from GraphQL
    return ctx.getContext().req;
  }

  /**
   * Constructor
   * @param {Reflector} reflector - reflector
   */
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Determines whether a user can activate the route
   * @param {ExecutionContext} context - execution context
   * @returns {boolean} - whether the user can activate
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

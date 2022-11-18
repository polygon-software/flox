import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Injectable()
export default class GqlThrottlerGuard extends ThrottlerGuard {
  /**
   * Extracts request response either from http or GraphQL context
   *
   * @param context - execution context
   * @returns request and response objects
   */
  getRequestResponse(context: ExecutionContext): {
    req: Request;
    res: Response;
  } {
    if (context.getType() === 'http') {
      return {
        req: context.switchToHttp().getRequest(),
        res: context.switchToHttp().getResponse(),
      };
    }
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx: { req: Request; res: Response } = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res }; // ctx.request and ctx.reply for fastify
  }
}

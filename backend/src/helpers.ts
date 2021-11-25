import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Gets the request from context
 * @param {ExecutionContext} context
 */
export function getRequest(context: ExecutionContext): any {
  const ctx = GqlExecutionContext.create(context);
  // If call is not from GraphQL, get req regularly
  if (!ctx.getContext()) {
    return context.switchToHttp().getRequest();
  }
  // Call is from GraphQL
  return ctx.getContext().req;
}

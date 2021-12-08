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

/**
 * Generates a short human-readable ID
 * @param {number} [length] - length of the ID to generate
 */
export function generateHumanReadableId(length = 10): string {
  let result = '';

  // Exclude I and l to avoid confusion
  const alphabet =
    'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return result;
}

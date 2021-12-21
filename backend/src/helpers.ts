import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as crypto from 'crypto';

/**
 * Gets the request from context
 * @param {ExecutionContext} context - Execution Context
 * @returns {Request} - the request
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
 * @returns {string} - an ID
 */
export function generateHumanReadableId(length = 10): string {
  let result = '';

  // Exclude I and l to avoid confusion
  const alphabet = '0123456789';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(crypto.randomInt(alphabet.length));
  }

  return result;
}

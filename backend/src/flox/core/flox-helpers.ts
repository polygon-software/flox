import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * This file contains all Flox helper functions for the backend
 */

/**
 * Gets the request from context
 * @param {ExecutionContext} context - execution context of the request
 * @returns {any} - the request
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
 * Determines a module's actual configuration based on defaults and custom config
 * @param {Record<string, unknown>} defaultConfig - The module's default configuration
 * @param {Record<string, unknown>} customConfig - custom configuration from flox.config.json (may be empty if not given)
 * @returns {Record<string, unknown>} - actual configuration to use
 */
export function mergeConfigurations(
  defaultConfig: Record<string, unknown>,
  customConfig?: Record<string, unknown>,
) {
  return { ...defaultConfig, ...customConfig };
}

import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

import flox from '../../../flox.config.json';
import Env from '../../env';
import { MODULES } from '../MODULES';
import { CognitoUser } from '../modules/auth/jwt.strategy';

import type User from '../modules/auth/entities/user.entity';

export interface FrontendRequest extends Request {
  user?: CognitoUser;
  principal?: User;
}

export type FloxModuleName = keyof typeof flox.modules;

/**
 * This file contains all Flox helper functions for the backend
 */

/**
 * Gets the request from context
 *
 * @param context - execution context of the request
 * @returns the request
 */
export function getRequest(context: ExecutionContext): FrontendRequest {
  const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
  // If call is not from GraphQL, get req regularly
  if (!ctx.getContext()) {
    return context.switchToHttp().getRequest();
  }
  // Call is from GraphQL
  const graphQlContext: { req: FrontendRequest } = ctx.getContext();
  return graphQlContext.req;
}

/**
 * Determines a module's actual configuration based on defaults and custom config
 *
 * @param defaultConfig - The module's default configuration
 * @param customConfig - custom configuration from flox.config.json (might be empty if not given)
 * @returns - actual configuration to use
 */
export function mergeConfigurations(
  defaultConfig: Record<string, unknown>,
  customConfig?: Record<string, unknown>,
): Record<string, unknown> {
  return { ...defaultConfig, ...customConfig };
}

/**
 * Gets the active Flox modules from config
 *
 * @returns - list of module names
 */
export function getActiveFloxModuleNames(): FloxModuleName[] {
  const modules: FloxModuleName[] = [];

  Object.entries(flox.modules).forEach(([moduleName, isActive]) => {
    if (isActive) {
      modules.push(moduleName as FloxModuleName);
    }
  });

  return modules;
}

/**
 * Gets the options for a single Flox module (with proper typing, since config is .js)
 *
 * @param moduleName - name of the module to check
 * @returns options for the modules
 */
export function floxModuleOptions(
  moduleName: keyof typeof flox.moduleOptions,
): Record<string, unknown> {
  if (!Object.values(MODULES).includes(moduleName as MODULES)) {
    throw new Error(`Invalid module '${moduleName}'`);
  }
  return flox.moduleOptions[moduleName];
}

/**
 * Gets the active Flox modules' options (with proper typing, since config is .js)
 *
 * @returns options for active modules
 */
export function floxModulesOptions(): Record<
  FloxModuleName,
  Record<string, unknown>
> {
  const options: Record<string, Record<string, unknown>> = {};

  // Get active modules
  const modules: FloxModuleName[] = getActiveFloxModuleNames();

  modules.forEach((module) => {
    options[module] = floxModuleOptions(module);
  });

  return options;
}

/**
 * Determines whether a Flox module is currently active from flox.config.json
 *
 * @param moduleName - name of the module to check
 * @returns whether the module is active
 */
export function isModuleActive(moduleName: FloxModuleName): boolean {
  return getActiveFloxModuleNames().includes(moduleName);
}

/**
 * Determines whether Flox is set to serverless mode in flox.config
 *
 * @returns whether the config is set to serverless mode
 */
export function isServerless(): boolean {
  return Env.SERVERLESS;
}

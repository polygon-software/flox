import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as flox from '../../../flox.config.json';
import { MODULES } from '../MODULES';

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

/**
 * Gets the active Flox modules from config
 * @returns {string[]} - list of module names
 */
export function getActiveFloxModuleNames() {
  const modules = [];

  Object.keys(flox.modules).forEach((moduleName) => {
    if (flox.modules[moduleName] === true) {
      modules.push(moduleName);
    }
  });

  return modules;
}

/**
 * Gets the options for a single Flox module (with proper typing, since config is .js)
 * @param {string} moduleName - name of the module to check
 * @returns {Record<string, Record<string, unknown>>} - options for the modules
 */
export function floxModuleOptions(moduleName: string) {
  if (!Object.values(MODULES).includes(moduleName as MODULES)) {
    throw new Error(`Invalid module '${moduleName}'`);
  }

  return (flox.moduleOptions[moduleName] ?? {}) as Record<string, unknown>;
}

/**
 * Gets the active Flox modules' options (with proper typing, since config is .js)
 * @returns {Record<string, Record<string, unknown>>} - options for active modules
 */
export function floxModulesOptions() {
  const options: Record<string, Record<string, unknown>> = {};

  // Get active modules
  const modules = getActiveFloxModuleNames();

  modules.forEach((module) => {
    options[module] = floxModuleOptions(module);
  });

  return options;
}

/**
 * Determines whether a Flox module is currently active from flox.config.json
 * @param {string} moduleName - name of the module to check
 * @returns {boolean} - whether the module is active
 */
export function isModuleActive(moduleName: string) {
  return getActiveFloxModuleNames().includes(moduleName);
}

/**
 * Determines whether Flox is set to serverless mode in flox.config
 * @returns {boolean} - whether the config is set to serverless mode
 */
export function isServerless() {
  return !!flox.general.serverless
}

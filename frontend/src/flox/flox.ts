import * as flox from '../../flox.config.js';

/**
 * Gets the active Flox modules from config
 * @returns {string[]} - list of module names
 */
export function floxModules() {
  const modules: string[] = [];

  Object.keys(flox.modules).forEach((moduleName) => {
    if (flox.modules[moduleName] === true) {
      modules.push(moduleName);
    }
  });

  return modules;
}

/**
 * Gets the active Flox modules' options (with proper typing, since config is .js)
 * @returns {Record<string, Record<string, unknown>>} - options for active modules
 */
export function floxModuleOptions() {
  const options: Record<string, Record<string, unknown>> = {}

  // Get active modules
  const modules = floxModules();

  modules.forEach((module) => {
    options[module] = (flox.moduleOptions[module] ?? {}) as Record<string, unknown>
  })

  return options;
}

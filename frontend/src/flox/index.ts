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
 * Gets the active Flox modules' options
 * @returns {Record<string, Record<string, unknown>>} - options for active modules
 */
export function floxModulesOptions() {
  const options: Record<string, Record<string, unknown>> = {}

  // Get active modules
  const modules = floxModules();

  modules.forEach((module) => {
    options[module] = (flox.moduleOptions[module] ?? {}) as Record<string, unknown>
  })

  return options;
}

/**
 * Gets the options for a single Flox module
 * @param {string} moduleName - name of the module to check
 * @returns {Record<string, Record<string, unknown>>} - options for the modules
 */
export function floxModuleOptions(moduleName: string) {
  return (flox.moduleOptions[moduleName] ?? {}) as Record<string, unknown>
}

/**
 * Determines whether a Flox module is currently active from flox.config.js
 * @param {string} moduleName - name of the module to check
 * @returns {boolean} - whether the module is active
 */
export function isModuleActive(moduleName: string){
  return floxModules().includes(moduleName)
}

/**
 * Determines a module's actual configuration based on defaults and custom config
 * @param {Record<string, unknown>} defaultConfig - The module's default configuration
 * @param {Record<string, unknown>} customConfig - custom configuration from flox.config.js (may be empty if not given)
 * @returns {Record<string, unknown>} - actual configuration to use
 */
export function mergeConfigurations(
  defaultConfig: Record<string, unknown>,
  customConfig?: Record<string, unknown>,
) {
  return { ...defaultConfig, ...customConfig };
}

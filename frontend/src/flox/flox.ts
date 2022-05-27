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

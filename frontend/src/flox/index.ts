import flox from '../../flox.config.json';

/**
 * Gets the active Flox modules from config
 *
 * @returns list of module names
 */
export function floxModules(): string[] {
  const modules: string[] = [];

  Object.keys(flox.modules).forEach((moduleName) => {
    if ((flox.modules as Record<string, boolean>)[moduleName]) {
      modules.push(moduleName);
    }
  });

  return modules;
}

/**
 * Gets the active Flox modules' options
 *
 * @returns options for active modules
 */
export function floxModulesOptions(): Record<string, Record<string, unknown>> {
  const options: Record<string, Record<string, unknown>> = {};

  // Get active modules
  const modules = floxModules();

  modules.forEach((module) => {
    options[module] =
      (flox.moduleOptions as Record<string, Record<string, unknown>>)[module] ??
      {};
  });

  return options;
}

/**
 * Gets the options for a single Flox module
 *
 * @param moduleName - name of the module to check
 * @returns options for the modules
 */
export function floxModuleOptions(moduleName: string): Record<string, unknown> {
  return (
    (flox.moduleOptions as Record<string, Record<string, unknown>>)[
      moduleName
    ] ?? {}
  );
}

/**
 * Determines whether a Flox module is currently active from flox.config.json
 *
 * @param moduleName - name of the module to check
 * @returns whether the module is active
 */
export function isModuleActive(moduleName: string): boolean {
  return floxModules().includes(moduleName);
}

/**
 * Determines a module's actual configuration based on defaults and custom config
 *
 * @param defaultConfig - The module's default configuration
 * @param customConfig - custom configuration from flox.config.json (may be empty if not given)
 * @returns actual configuration to use
 */
export function mergeConfigurations(
  defaultConfig: Record<string, unknown>,
  customConfig?: Record<string, unknown>
): Record<string, unknown> {
  return { ...defaultConfig, ...customConfig };
}

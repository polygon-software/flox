import { mergeConfigurations } from '../../core/flox-helpers';
import { floxModuleOptions } from '../../flox';
import { MODULES } from '../../MODULES';

/**
 * The file module handles file up/download using a database table each for private and public files, as well as storing
 * the files in S3 and requesting corresponding URLs.
 */

type EmailModuleConfig = {
  emailSender: string;
};

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: EmailModuleConfig = {
  emailSender: 'noreply@polygon-software.ch',
};

/**
 * Gets the module's actual configuration
 * @returns {FileModuleConfig} - configuration
 */
export function moduleConfig() {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.EMAIL),
  ) as EmailModuleConfig;
}

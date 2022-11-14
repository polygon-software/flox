import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';

/**
 * The file module handles file up/download using a database tables each for private and public files, as well as storing
 * the files in S3 and requesting corresponding URLs.
 */

type EmailModuleConfig = {
  emailSender: string;
};

// Default configuration set; will get merged with custom config from flox.config.js
const defaultConfig: EmailModuleConfig = {
  emailSender: 'noreply',
};

/**
 * Gets the module's actual configuration
 * @returns configuration
 */
export function moduleConfig() {
  if (!process.env.BASE_URL) {
    throw Error('Required env variable BASE_URL is missing');
  }
  // The domain the emails are sent from
  const domain = process.env.BASE_URL.split('//')[1];
  const correctedDefaultEmail = `${defaultConfig.emailSender}@${domain}`;
  const correctedDefaultConfig = {
    ...defaultConfig,
    emailSender: correctedDefaultEmail, // the default sender name appended to the domain
  };
  const floxModuleConfig = floxModuleOptions(MODULES.EMAIL);
  if (floxModuleConfig.emailSender) {
    floxModuleConfig.emailSender = `${
      floxModuleOptions(MODULES.EMAIL).emailSender // the configured sender name appended to the domain
    }@${domain}`;
  }

  return mergeConfigurations(
    correctedDefaultConfig,
    floxModuleConfig,
  ) as EmailModuleConfig;
}

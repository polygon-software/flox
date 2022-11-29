import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';
import Env from '../../../env';

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
export function moduleConfig(): EmailModuleConfig {
  if (!Env.BASE_URL || !Env.BASE_URL.includes('//')) {
    throw Error('Required env variable BASE_URL is missing or malformed');
  }
  // The domain the emails are sent from
  const domain = Env.BASE_URL.split('//')[1];
  const correctedDefaultEmail = `${defaultConfig.emailSender}@${domain}`;
  const correctedDefaultConfig = {
    ...defaultConfig,
    emailSender: correctedDefaultEmail, // The default sender name appended to the domain
  };
  const floxModuleConfig = floxModuleOptions(MODULES.EMAIL);
  if (floxModuleConfig.emailSender) {
    floxModuleConfig.emailSender = `${
      floxModuleOptions(MODULES.EMAIL).emailSender // The configured sender name appended to the domain
    }@${domain}`;
  }

  return mergeConfigurations(
    correctedDefaultConfig,
    floxModuleConfig,
  ) as EmailModuleConfig;
}

import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';
import Env from '../../../env';

/**
 * The email Module handles email sending.
 */

type EmailModuleConfig = {
  emailSender: string;
  emailAddress: string;
};

// Default configuration set; will get merged with custom config from flox.config.js
// emailSender refers to the part before '@' (e.g. infO)
// emailAddress refers to the complete address from where the email will be sent (e.g. info@dev.polygon-project.ch)
const defaultConfig: EmailModuleConfig = {
  emailSender: 'noreply',
  emailAddress: '',
};

/**
 * Gets the module's actual configuration
 *
 * @returns {EmailModuleConfig} - configuration
 */
export function moduleConfig(): EmailModuleConfig {
  if (!Env.BASE_URL || !Env.BASE_URL.includes('//')) {
    throw Error('Required env variable BASE_URL is missing or malformed');
  }

  // Check if emailSender has alreay been constructed
  if (defaultConfig.emailAddress) {
    return defaultConfig;
  }

  // Construct email sender from either flox config or default config
  let domain = Env.BASE_URL.split('//')[1];
  if (domain.includes('localhost')) {
    domain = `${Env.DEV ? 'dev' : 'test'}.${
      Env.PROJECT_NAME
    }.polygon-project.ch`;
  }

  // Fetch the e-mail config from the flox config file
  const floxModuleConfig = floxModuleOptions(
    MODULES.EMAIL,
  ) as EmailModuleConfig;

  if (floxModuleConfig.emailSender) {
    const floxConfigEmail = `${floxModuleConfig.emailSender}@${domain}`;
    return {
      emailSender: floxModuleConfig.emailSender,
      emailAddress: floxConfigEmail,
    };
  }
  const correctedDefaultEmail = `${defaultConfig.emailSender}@${domain}`;
  return {
    emailSender: defaultConfig.emailSender,
    emailAddress: correctedDefaultEmail,
  };
}

export default moduleConfig;

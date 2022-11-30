import {
  floxModuleOptions,
  mergeConfigurations,
} from '../../core/flox-helpers';
import { MODULES } from '../../MODULES';

/**
 * The Payment module handles stripe payments.
 */

type PaymentModuleConfig = {
  // Payment module has no options
};

// Default configuration set; will get merged with custom config from flox.config.json
const defaultConfig: PaymentModuleConfig = {
  // Payment module has no options
};

/**
 * Gets the module's actual configuration
 *
 * @returns configuration
 */
export function moduleConfig(): PaymentModuleConfig {
  return mergeConfigurations(
    defaultConfig,
    floxModuleOptions(MODULES.PAYMENT),
  ) as PaymentModuleConfig;
}
export default moduleConfig;
